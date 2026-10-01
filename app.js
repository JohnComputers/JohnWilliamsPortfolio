(() => {
  "use strict";
  const cfg = window.PROJECT_HUB_CONFIG || {};
  const state = { repos: [], query: "", quick: "all", category: "", sort: "featured", view: "grid" };
  const $ = (id) => document.getElementById(id);
  const githubOwner = cfg.github?.owner || "JohnComputers";
  const featuredSet = new Set(cfg.featured || []);
  const hiddenSet = new Set(cfg.repositoryRules?.hideRepositories || []);
  const overrides = cfg.projectOverrides || {};

  function cssVars() {
    const t = cfg.theme || {};
    const root = document.documentElement;
    const vars = {
      "--accent": t.accent, "--accent2": t.accent2, "--bg": t.background,
      "--surface": t.surface, "--surface2": t.surface2, "--text": t.text,
      "--muted": t.muted, "--border": t.border,
      "--radius": Number.isFinite(+t.cardRadius) ? `${+t.cardRadius}px` : null,
      "--max-width": Number.isFinite(+t.maxWidth) ? `${+t.maxWidth}px` : null,
      "--card-min": Number.isFinite(+t.cardMinWidth) ? `${+t.cardMinWidth}px` : null
    };
    Object.entries(vars).forEach(([k,v]) => v && root.style.setProperty(k,v));
    if (cfg.customCss) {
      const style = document.createElement("style");
      style.dataset.custom = "true";
      style.textContent = cfg.customCss;
      document.head.appendChild(style);
    }
  }

  function applyBrand() {
    const b = cfg.brand || {};
    const set = (id, value) => { const el=$(id); if(el && value != null) el.textContent=value; };
    set("brandMark", b.shortName || "JC");
    set("brandName", b.name || "Project Hub");
    set("brandEyebrow", b.eyebrow || githubOwner);
    set("heroKicker", b.heroKicker);
    set("heroTitle", b.heroTitle);
    set("heroSubtitle", b.heroSubtitle);
    set("aboutTitle", b.aboutTitle);
    set("aboutText", b.aboutText);
    set("footerBrand", b.name || "Project Hub");
    set("footerText", b.footerText || "Built from GitHub.");
    document.title = b.name || "Project Hub";
    const profile = cfg.github?.profileUrl || `https://github.com/${githubOwner}`;
    ["githubProfileLink","heroGithubLink","footerGithubLink"].forEach(id => { if($(id)) $(id).href=profile; });
  }

  function cleanName(name="") { return name.replace(/[._-]+/g," ").replace(/\b\w/g,m=>m.toUpperCase()); }

  function inferCategory(repo) {
    const ov = overrides[repo.name];
    if (ov?.category) return ov.category;
    const hay = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    for (const cat of cfg.categories || []) {
      if ((cat.keywords || []).some(k => hay.includes(String(k).toLowerCase()))) return cat.name;
    }
    return "Other";
  }

  function categoryIcon(name) {
    const cat=(cfg.categories || []).find(c=>c.name===name);
    return cat?.icon || "◇";
  }

  function normalize(repo) {
    const ov = overrides[repo.name] || {};
    const category = inferCategory(repo);
    let launchUrl = ov.launchUrl || "";
    if (!launchUrl && cfg.repositoryRules?.autoDetectLiveSites !== false) {
      if (repo.homepage && /^https?:\/\//i.test(repo.homepage)) launchUrl = repo.homepage;
      else if (repo.has_pages) launchUrl = `https://${githubOwner}.github.io/${repo.name}/`;
    }
    return {
      ...repo,
      title: ov.title || cleanName(repo.name),
      displayDescription: ov.description || repo.description || "A project from my GitHub collection.",
      category,
      icon: ov.icon || categoryIcon(category),
      launchUrl,
      featured: featuredSet.has(repo.name),
      hidden: !!ov.hidden,
      hideLaunch: !!ov.hideLaunch,
      tags: Array.isArray(ov.tags) ? ov.tags : []
    };
  }

  function allowed(repo) {
    const rules=cfg.repositoryRules || {};
    if (repo.visibility && repo.visibility !== "public") return false;
    if (!rules.includeArchived && repo.archived) return false;
    if (!rules.includeForks && repo.fork) return false;
    if (!rules.includeEmpty && Number(repo.size) === 0) return false;
    if (hiddenSet.has(repo.name)) return false;
    if (overrides[repo.name]?.hidden) return false;
    return true;
  }

  async function loadRepos() {
    $("syncStatus").textContent = "Syncing public repositories…";
    $("loadError").hidden = true;
    try {
      const url = `https://api.github.com/users/${encodeURIComponent(githubOwner)}/repos?per_page=${cfg.github?.reposPerPage || 100}&type=owner&sort=updated`;
      const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" }});
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      state.repos = data.filter(allowed).map(normalize);
      $("syncStatus").textContent = "Live data from GitHub";
      renderAll();
    } catch (err) {
      console.error(err);
      state.repos = Object.keys(overrides).map(name => normalize({
        name, html_url:`https://github.com/${githubOwner}/${name}`, description:"",
        language:null, stargazers_count:0, updated_at:null, size:1, visibility:"public",
        has_pages:false, homepage:"", archived:false, fork:false, topics:[]
      })).filter(allowed);
      $("syncStatus").textContent = "Using configured projects";
      $("loadError").hidden = state.repos.length > 0;
      renderAll();
    }
  }

  function filteredRepos() {
    const q=state.query.trim().toLowerCase();
    let list=state.repos.filter(r => {
      if (state.quick==="live" && !r.launchUrl) return false;
      if (state.quick==="featured" && !r.featured) return false;
      if (state.category && r.category!==state.category) return false;
      if (!q) return true;
      return [r.title,r.name,r.displayDescription,r.language,r.category,...r.tags,...(r.topics||[])]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
    list.sort((a,b) => {
      if (state.sort==="name") return a.title.localeCompare(b.title);
      if (state.sort==="stars") return (b.stargazers_count||0)-(a.stargazers_count||0);
      if (state.sort==="updated") return new Date(b.updated_at||0)-new Date(a.updated_at||0);
      if (a.featured!==b.featured) return a.featured ? -1 : 1;
      return new Date(b.updated_at||0)-new Date(a.updated_at||0);
    });
    return list;
  }

  function metaPill(text, dot=false) {
    const span=document.createElement("span");
    span.className="meta-pill";
    if (dot) {
      const d=document.createElement("span"); d.className="language-dot"; span.appendChild(d);
    }
    span.append(document.createTextNode(text));
    return span;
  }

  function renderCard(repo) {
    const node=$("projectTemplate").content.firstElementChild.cloneNode(true);
    node.dataset.repo=repo.name;
    node.querySelector(".category-badge").textContent=repo.category;
    const fb=node.querySelector(".featured-badge"); fb.hidden=!repo.featured;
    node.querySelector(".project-icon").textContent=repo.icon;
    node.querySelector(".project-title").textContent=repo.title;
    node.querySelector(".repo-name").textContent=repo.name;
    node.querySelector(".project-description").textContent=repo.displayDescription;
    const meta=node.querySelector(".project-meta");
    if (repo.language) meta.appendChild(metaPill(repo.language,true));
    if ((repo.stargazers_count||0)>0) meta.appendChild(metaPill(`★ ${repo.stargazers_count}`));
    if (repo.updated_at) meta.appendChild(metaPill(`Updated ${new Intl.DateTimeFormat(undefined,{month:"short",year:"numeric"}).format(new Date(repo.updated_at))}`));
    const launch=node.querySelector(".launch-button");
    const source=node.querySelector(".repo-button");
    if (repo.launchUrl && !repo.hideLaunch && cfg.repositoryRules?.showLiveButton !== false) {
      launch.href=repo.launchUrl;
      launch.textContent=cfg.labels?.launch || "Launch";
    } else launch.remove();
    if (cfg.repositoryRules?.showSourceButton !== false) {
      source.href=repo.html_url || `https://github.com/${githubOwner}/${repo.name}`;
      source.textContent=cfg.labels?.source || "GitHub";
    } else source.remove();
    return node;
  }

  function renderProjects() {
    const list=filteredRepos(), grid=$("projectGrid");
    grid.replaceChildren(...list.map(renderCard));
    $("resultsCopy").textContent=`${list.length} of ${state.repos.length} projects`;
    $("emptyState").hidden=list.length!==0;
  }

  function renderCategories() {
    const strip=$("categoryStrip");
    const counts=new Map();
    state.repos.forEach(r=>counts.set(r.category,(counts.get(r.category)||0)+1));
    const configured=(cfg.categories||[]).map(c=>c.name);
    const names=[...configured,...[...counts.keys()].filter(x=>!configured.includes(x))].filter(x=>counts.has(x));
    strip.replaceChildren(...names.map(name=>{
      const c=(cfg.categories||[]).find(x=>x.name===name)||{name,icon:"◇"};
      const btn=document.createElement("button"); btn.type="button"; btn.className="category-card"+(state.category===name?" active":"");
      btn.dataset.category=name;
      const icon=document.createElement("span"); icon.className="category-icon"; icon.textContent=c.icon||"◇";
      const title=document.createElement("span"); title.className="category-name"; title.textContent=name;
      const count=document.createElement("span"); count.className="category-count"; count.textContent=`${counts.get(name)} project${counts.get(name)===1?"":"s"}`;
      btn.append(icon,title,count);
      btn.addEventListener("click",()=>{state.category=state.category===name?"":name; renderAll();});
      return btn;
    }));
    $("clearCategory").hidden=!state.category;
    $("categoryCount").textContent=String(names.length);
  }

  function renderStats() {
    $("repoCount").textContent=String(state.repos.length);
    $("liveCount").textContent=String(state.repos.filter(r=>r.launchUrl && !r.hideLaunch).length);
  }

  function renderAll(){ renderStats(); renderCategories(); renderProjects(); }

  function bind() {
    $("searchInput").addEventListener("input",e=>{state.query=e.target.value; renderProjects();});
    $("sortSelect").addEventListener("change",e=>{state.sort=e.target.value; renderProjects();});
    $("quickFilters").addEventListener("click",e=>{
      const btn=e.target.closest("[data-filter]"); if(!btn) return;
      state.quick=btn.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===btn));
      renderProjects();
    });
    $("clearCategory").addEventListener("click",()=>{state.category=""; renderAll();});
    $("resetFilters").addEventListener("click",()=>{
      state.query="";state.quick="all";state.category="";state.sort="featured";
      $("searchInput").value="";$("sortSelect").value="featured";
      document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));
      renderAll();
    });
    $("retryButton").addEventListener("click",loadRepos);
    $("gridViewButton").addEventListener("click",()=>setView("grid"));
    $("listViewButton").addEventListener("click",()=>setView("list"));
    document.addEventListener("keydown",e=>{
      if(e.key==="/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||"")) {
        e.preventDefault(); $("searchInput").focus();
      }
    });
  }

  function setView(view){
    state.view=view;
    $("projectGrid").classList.toggle("list-view",view==="list");
    $("gridViewButton").classList.toggle("active",view==="grid");
    $("listViewButton").classList.toggle("active",view==="list");
  }

  cssVars(); applyBrand(); bind(); loadRepos();
})();