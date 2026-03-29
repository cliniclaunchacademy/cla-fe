import { useEffect, useRef, useState, useCallback } from "react";

const FONTS = ["Roboto", "Georgia", "Courier New", "Arial", "Verdana"];
const SIZE_MAP = { Small: "1", Normal: "3", Large: "5", Huge: "7" };
const COLOR_PRESETS = ["#000000","#374151","#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899","#FFFFFF"];
const HIGHLIGHT_PRESETS = ["#FEF08A","#BBF7D0","#BAE6FD","#FCA5A5","#DDD6FE","#FED7AA"];

const Divider = () => <div style={{width:1,height:20,background:"#e2e8f0",margin:"0 3px",flexShrink:0}}/>;

function Btn({onClick,active,title,children}){
  const [h,setH]=useState(false);
  return(
    <button onMouseDown={e=>{e.preventDefault();onClick?.();}} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,
        border:"none",borderRadius:5,cursor:"pointer",padding:0,flexShrink:0,transition:"all 0.1s",
        background:active?"#dbeafe":h?"#f1f5f9":"transparent",color:active?"#1d4ed8":"#374151"}}>
      {children}
    </button>
  );
}

function Sel({value,options,onChange,width=100}){
  return(
    <div style={{position:"relative",width,flexShrink:0}}>
      <select value={value} onChange={e=>onChange(e.target.value)} onMouseDown={e=>e.stopPropagation()}
        style={{height:28,border:"1px solid #e2e8f0",borderRadius:5,background:"white",color:"#374151",
          fontSize:12,padding:"0 20px 0 7px",cursor:"pointer",width:"100%",outline:"none",appearance:"none"}}>
        {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
      </select>
      <svg style={{position:"absolute",right:5,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}
        width="9" height="5" viewBox="0 0 9 5">
        <path d="M1 1l3.5 3L8 1" stroke="#9ca3af" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function App(){
  const editorRef=useRef(null);
  const fcRef=useRef(null);
  const hlRef=useRef(null);
  const [fmt,setFmt]=useState({});
  const [font,setFont]=useState("Roboto");
  const [size,setSize]=useState("Normal");
  const [fontColor,setFontColor]=useState("#000000");
  const [hlColor,setHlColor]=useState("#FEF08A");
  const [showFC,setShowFC]=useState(false);
  const [showHL,setShowHL]=useState(false);
  const [words,setWords]=useState(0);
  const [chars,setChars]=useState(0);
  const [isEmpty,setIsEmpty]=useState(true);
  const [linkModal,setLinkModal]=useState(false);
  const [linkUrl,setLinkUrl]=useState("https://");
  const [htmlOut,setHtmlOut]=useState("");

  const exec=useCallback((cmd,val=null)=>{
    editorRef.current?.focus();
    document.execCommand(cmd,false,val);
    updateFmt();
  },[]);

  const updateFmt=useCallback(()=>{
    setFmt({
      bold:document.queryCommandState("bold"),
      italic:document.queryCommandState("italic"),
      underline:document.queryCommandState("underline"),
      strikeThrough:document.queryCommandState("strikeThrough"),
      insertOrderedList:document.queryCommandState("insertOrderedList"),
      insertUnorderedList:document.queryCommandState("insertUnorderedList"),
      justifyLeft:document.queryCommandState("justifyLeft"),
      justifyCenter:document.queryCommandState("justifyCenter"),
      justifyRight:document.queryCommandState("justifyRight"),
      subscript:document.queryCommandState("subscript"),
      superscript:document.queryCommandState("superscript"),
    });
  },[]);

  const handleInput=()=>{
    const txt=editorRef.current?.innerText||"";
    setIsEmpty(txt.trim()==="");
    setWords(txt.trim()?txt.trim().split(/\s+/).length:0);
    setChars(txt.replace(/\n/g,"").length);
    setHtmlOut(editorRef.current?.innerHTML||"");
    updateFmt();
  };

  useEffect(()=>{
    const h=e=>{
      if(!fcRef.current?.contains(e.target))setShowFC(false);
      if(!hlRef.current?.contains(e.target))setShowHL(false);
    };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const insertLink=()=>{
    if(linkUrl&&linkUrl!=="https://")exec("createLink",linkUrl);
    setLinkModal(false);setLinkUrl("https://");
  };

  const ic={
    B:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
    I:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
    U:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
    S:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 5.5 7 8C7 10 8.5 11 10 11.5"/><path d="M8 18C8 18 9.5 20 12 20C14.5 20 17 18.5 17 16C17 14 15.5 13 14 12.5"/></svg>,
    FC:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
    HL:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.2-4.2c-.8-.8-2-.8-2.8 0L9 14l6 6 4.8-4.8c.8-.8.8-2.2 0-3z"/></svg>,
    OL:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
    UL:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
    AL:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
    AC:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>,
    AR:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
    SUB:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>,
    SUP:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.44-2 1.5-2.5S20 8.33 20 7c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>,
    LK:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    IMG:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  };

  const ColorPicker=({color,presets,onSelect,label,onCustom})=>(
    <div style={{position:"absolute",top:36,left:0,zIndex:999,background:"white",border:"1px solid #e2e8f0",
      borderRadius:8,padding:10,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",minWidth:150}}>
      <div style={{fontSize:11,color:"#6b7280",marginBottom:6,fontWeight:600}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {presets.map(c=>(
          <button key={c} onMouseDown={e=>{e.preventDefault();onSelect(c);}}
            style={{width:22,height:22,borderRadius:4,padding:0,cursor:"pointer",flexShrink:0,
              background:c==="transparent"?"repeating-conic-gradient(#e2e8f0 0% 25%,white 0% 50%) 0 0/8px 8px":c,
              border:c===color?"2px solid #3b82f6":"1px solid #d1d5db"}}/>
        ))}
      </div>
      {onCustom&&(
        <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:11,color:"#6b7280"}}>Custom:</span>
          <input type="color" defaultValue={color||"#000000"} onChange={e=>onCustom(e.target.value)}
            style={{width:40,height:22,padding:0,border:"1px solid #e2e8f0",borderRadius:4,cursor:"pointer"}}/>
        </div>
      )}
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"28px 16px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:740}}>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Dashboard · New Post</div>
          <h1 style={{margin:0,fontSize:20,fontWeight:700,color:"#0f172a"}}>Rich Text Editor</h1>
        </div>

        <div style={{background:"white",borderRadius:12,border:"1px solid #e5e7eb",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          {/* Toolbar */}
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:2,padding:"8px 10px",
            borderBottom:"1px solid #f0f0f0",background:"#fafafa",borderRadius:"12px 12px 0 0",userSelect:"none"}}>
            <Sel value={font} options={FONTS.map(f=>({value:f,label:f}))} onChange={v=>{setFont(v);exec("fontName",v);}} width={105}/>
            <div style={{width:4}}/>
            <Sel value={size} options={Object.keys(SIZE_MAP).map(s=>({value:s,label:s}))} onChange={v=>{setSize(v);exec("fontSize",SIZE_MAP[v]);}} width={76}/>
            <Divider/>
            <Btn onClick={()=>exec("bold")} active={fmt.bold} title="Bold">{ic.B}</Btn>
            <Btn onClick={()=>exec("italic")} active={fmt.italic} title="Italic">{ic.I}</Btn>
            <Btn onClick={()=>exec("underline")} active={fmt.underline} title="Underline">{ic.U}</Btn>
            <Btn onClick={()=>exec("strikeThrough")} active={fmt.strikeThrough} title="Strikethrough">{ic.S}</Btn>
            <Divider/>
            <div ref={fcRef} style={{position:"relative"}}>
              <button onMouseDown={e=>{e.preventDefault();setShowFC(p=>!p);setShowHL(false);}} title="Font Color"
                style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  width:28,height:28,border:"none",borderRadius:5,background:showFC?"#f1f5f9":"transparent",cursor:"pointer",gap:2,padding:3}}>
                {ic.FC}<div style={{width:14,height:3,borderRadius:2,background:fontColor,border:"1px solid #e2e8f0"}}/>
              </button>
              {showFC&&<ColorPicker color={fontColor} presets={COLOR_PRESETS} label="Font color"
                onSelect={c=>{setFontColor(c);exec("foreColor",c);setShowFC(false);}}
                onCustom={c=>{setFontColor(c);exec("foreColor",c);}}/>}
            </div>
            <div ref={hlRef} style={{position:"relative"}}>
              <button onMouseDown={e=>{e.preventDefault();setShowHL(p=>!p);setShowFC(false);}} title="Highlight"
                style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  width:28,height:28,border:"none",borderRadius:5,background:showHL?"#f1f5f9":"transparent",cursor:"pointer",gap:2,padding:3}}>
                {ic.HL}<div style={{width:14,height:3,borderRadius:2,background:hlColor,border:"1px solid #e2e8f0"}}/>
              </button>
              {showHL&&<ColorPicker color={hlColor} presets={HIGHLIGHT_PRESETS} label="Highlight"
                onSelect={c=>{setHlColor(c);exec("hiliteColor",c);setShowHL(false);}}/>}
            </div>
            <Divider/>
            <Btn onClick={()=>exec("insertOrderedList")} active={fmt.insertOrderedList} title="Numbered List">{ic.OL}</Btn>
            <Btn onClick={()=>exec("insertUnorderedList")} active={fmt.insertUnorderedList} title="Bullet List">{ic.UL}</Btn>
            <Divider/>
            <Btn onClick={()=>exec("justifyLeft")} active={fmt.justifyLeft} title="Align Left">{ic.AL}</Btn>
            <Btn onClick={()=>exec("justifyCenter")} active={fmt.justifyCenter} title="Align Center">{ic.AC}</Btn>
            <Btn onClick={()=>exec("justifyRight")} active={fmt.justifyRight} title="Align Right">{ic.AR}</Btn>
            <Divider/>
            <Btn onClick={()=>exec("subscript")} active={fmt.subscript} title="Subscript">{ic.SUB}</Btn>
            <Btn onClick={()=>exec("superscript")} active={fmt.superscript} title="Superscript">{ic.SUP}</Btn>
            <Divider/>
            <Btn onClick={()=>setLinkModal(true)} title="Insert Link">{ic.LK}</Btn>
            <Btn onClick={()=>{const u=prompt("Image URL:");if(u)exec("insertImage",u);}} title="Insert Image">{ic.IMG}</Btn>
          </div>

          {/* Editor */}
          <div style={{position:"relative"}}>
            {isEmpty&&(
              <div style={{position:"absolute",top:16,left:16,color:"#9ca3af",pointerEvents:"none",fontSize:15,fontFamily:font,userSelect:"none",zIndex:1}}>
                Compose an epic..
              </div>
            )}
            <div ref={editorRef} contentEditable suppressContentEditableWarning
              onInput={handleInput} onKeyUp={updateFmt} onMouseUp={updateFmt} onSelect={updateFmt}
              style={{minHeight:280,padding:16,outline:"none",fontSize:15,lineHeight:1.8,color:"#1f2937",fontFamily:font,zIndex:2,position:"relative"}}
            />
          </div>

          <div style={{borderTop:"1px solid #f0f0f0",padding:"6px 14px",display:"flex",justifyContent:"flex-end",gap:14,background:"#fafafa",borderRadius:"0 0 12px 12px"}}>
            <span style={{fontSize:11.5,color:"#9ca3af"}}>{words} words</span>
            <span style={{fontSize:11.5,color:"#9ca3af"}}>{chars} chars</span>
          </div>
        </div>

        <div style={{marginTop:10,padding:"10px 14px",background:"white",borderRadius:10,border:"1px solid #e5e7eb"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>HTML Output</div>
          <pre style={{margin:0,fontSize:10.5,color:"#374151",background:"#f8fafc",borderRadius:6,padding:"8px 10px",overflow:"auto",maxHeight:72,whiteSpace:"pre-wrap",wordBreak:"break-all",fontFamily:"monospace"}}>
            {htmlOut||"<empty>"}
          </pre>
        </div>
      </div>

      {linkModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div style={{background:"white",borderRadius:12,padding:24,width:320,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:600,color:"#111827",marginBottom:12,fontSize:15}}>Insert Link</div>
            <input value={linkUrl} onChange={e=>setLinkUrl(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&insertLink()}
              style={{width:"100%",height:36,border:"1px solid #e2e8f0",borderRadius:7,padding:"0 10px",fontSize:14,outline:"none",boxSizing:"border-box"}} autoFocus/>
            <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}>
              <button onMouseDown={()=>{setLinkModal(false);setLinkUrl("https://");}}
                style={{height:32,padding:"0 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"white",color:"#374151",fontSize:13,cursor:"pointer"}}>Cancel</button>
              <button onMouseDown={insertLink}
                style={{height:32,padding:"0 14px",borderRadius:7,border:"none",background:"#3b82f6",color:"white",fontSize:13,fontWeight:500,cursor:"pointer"}}>Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}