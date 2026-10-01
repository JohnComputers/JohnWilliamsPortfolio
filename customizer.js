(() => {
  "use strict";
  const original=JSON.parse(JSON.stringify(window.PROJECT_HUB_CONFIG||{}));
  let config=JSON.parse(JSON.stringify(original));
  const $=id=>document.getElementById(id);
  const lineList=v=>String(v||"").split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const deepMerge=(a,b)=>{
    if(Array.isArray(b)) return b;
    if(b && typeof b==="object"){const out={...(a||{})};Object.keys(b).forEach(k=>out[k]=deepMerge(out[k],b[k]));return out;}
    return b;
  };
  function fill(){
    $("brandName").value=config.brand?.name||"";
    $("shortName").value=config.brand?.shortName||"";
    $("heroTitle").value=config.brand?.heroTitle||"";
    $("heroSubtitle").value=config.brand?.heroSubtitle||"";
    $("heroKicker").value=config.brand?.heroKicker||"";
    $("footerText").value=config.brand?.footerText||"";
    ["accent","accent2","background","surface","surface2","text","muted","border"].forEach(k=>$(k).value=config.theme?.[k]||"#000000");
    $("cardRadius").value=config.theme?.cardRadius??22;
    $("cardMinWidth").value=config.theme?.cardMinWidth??280;
    $("featured").value=(config.featured||[]).join("\n");
    $("hiddenRepos").value=(config.repositoryRules?.hideRepositories||[]).join("\n");
    $("rawConfig").value=JSON.stringify(config,null,2);
    preview();
  }
  function collect(){
    config.brand=config.brand||{};config.theme=config.theme||{};config.repositoryRules=config.repositoryRules||{};
    config.brand.name=$("brandName").value.trim();
    config.brand.shortName=$("shortName").value.trim();
    config.brand.heroTitle=$("heroTitle").value.trim();
    config.brand.heroSubtitle=$("heroSubtitle").value.trim();
    config.brand.heroKicker=$("heroKicker").value.trim();
    config.brand.footerText=$("footerText").value.trim();
    ["accent","accent2","background","surface","surface2","text","muted","border"].forEach(k=>config.theme[k]=$(k).value);
    config.theme.cardRadius=Math.max(0,Math.min(60,Number($("cardRadius").value)||0));
    config.theme.cardMinWidth=Math.max(220,Math.min(500,Number($("cardMinWidth").value)||280));
    config.featured=lineList($("featured").value);
    config.repositoryRules.hideRepositories=lineList($("hiddenRepos").value);
    $("rawConfig").value=JSON.stringify(config,null,2);
    preview();
  }
  function preview(){
    const t=config.theme||{},b=config.brand||{};
    const root=$("preview");
    [["--accent",t.accent],["--accent2",t.accent2],["--bg",t.background],["--surface",t.surface],["--surface2",t.surface2],["--text",t.text],["--muted",t.muted],["--border",t.border],["--radius",(t.cardRadius||22)+"px"]].forEach(([k,v])=>v&&root.style.setProperty(k,v));
    $("pMark").textContent=b.shortName||"JC";$("pName").textContent=b.name||"Project Hub";$("pKicker").textContent=b.heroKicker||"";$("pTitle").textContent=b.heroTitle||"";$("pCopy").textContent=b.heroSubtitle||"";
  }
  function jsFile(){
    return "window.PROJECT_HUB_CONFIG = "+JSON.stringify(config,null,2)+";\n";
  }
  $("customizerForm").addEventListener("input",e=>{if(e.target.id!=="rawConfig") collect();});
  $("applyRaw").addEventListener("click",()=>{
    try{const parsed=JSON.parse($("rawConfig").value);config=deepMerge(config,parsed);fill();$("notice").textContent="JSON applied successfully. Download the config when ready.";}
    catch(e){$("notice").textContent="Invalid JSON: "+e.message;}
  });
  $("resetCurrent").addEventListener("click",()=>{config=JSON.parse(JSON.stringify(original));fill();$("notice").textContent="Reset to the configuration currently stored in the repo.";});
  $("downloadConfig").addEventListener("click",()=>{
    collect();
    const blob=new Blob([jsFile()],{type:"text/javascript"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="site.config.js";document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    $("notice").textContent="Downloaded site.config.js. Replace the repo's existing file with it to publish.";
  });
  fill();
})();