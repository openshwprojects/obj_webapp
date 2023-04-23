
function findUserParamKey(js)
{
    if(js.user_param_key != undefined)
        return js.user_param_key;
    if(js.device_configuration != undefined)
        return js.device_configuration;
        
    return js;
}
function processJSON_UserParamKeyStyle(js,user_param_key) {
    console.log("Entering processJSON_UserParamKeyStyle");
    let tmpl = {
        vendor: "Tuya",
        bDetailed: "0",
        name: "TODO",
        model: "TODO",
        chip: "BK7231T",
        board: "TODO",
        keywords: [],
        pins:[],
        command: "",
        image: "https://obrazki.elektroda.pl/YOUR_IMAGE.jpg",
        wiki: "https://www.elektroda.com/rtvforum/topic_YOUR_TOPIC.html"
      };
      
      if(js.manufacturer!=undefined){
        tmpl.vendor = js.manufacturer;
      }
      if(js.name!=undefined){
        tmpl.name = js.name;
      }

    let desc = "";
    let scr = "";
    
    let value;
    for(let i = 0; i < 10; i++) {
        let name = "rl"+i+"_pin";
        value = user_param_key[name];
        if(value != undefined) {
            desc += "- Relay (channel " +i + ") on P"+value+"\n";
            scr += "backlog setPinRole "+value+" Rel"+"; ";
            scr += "setPinChannel "+value+" "+i+"\n";
        }
    }
    for(let i = -1; i < 10; i++) {
        let name;
        name = "netled";
        if(i != -1) {
            name += i;
        } 
        name += "_pin";
        value = user_param_key[name];
        if(value != undefined) {
            desc += "- WiFi LED on P"+value+"\n";
            scr += "setPinRole "+value+" WifiLED_n"+"\n";
        }
    }
    for(let i = 0; i < 10; i++) {
        let name = "door"+i+"_magt_pin";
        value = user_param_key[name];
        if(value != undefined) {
            desc += "- Door Sensor (channel " +i + ") on P"+value+"\n";
            scr += "backlog setPinRole "+value+" dInput"+"; ";
            scr += "setPinChannel "+value+" "+i+"\n";
        }
    }
    for(let i = 0; i < 10; i++) {
        let name = "bt"+i+"_pin";
        value = user_param_key[name];
        if(value != undefined) {
            desc += "- Button (channel " +i + ") on P"+value+"\n";
            scr += "backlog setPinRole "+value+" Btn"+"; ";
            scr += "setPinChannel "+value+" "+i+"\n";
        }
    }
    for(let i = 0; i < 10; i++) {
        let name = "onoff"+i+"";
        value = user_param_key[name];
        if(value != undefined) {
            desc += "- TglChannelToggle (channel " +i + ") on P"+value+"\n";
            scr += "backlog setPinRole "+value+" TglChanOnTgl"+"; ";
            scr += "setPinChannel "+value+" "+i+"\n";
        }
    }
    value = user_param_key.ele_pin;
    if(value != undefined) {
        desc += "- BL0937 ELE on P"+value+"\n";
        scr += "setPinRole "+value+" BL0937CF"+"\n";
    }
    value = user_param_key.vi_pin;
    if(value != undefined) {
        desc += "- BL0937 VI on P"+value+"\n";
        scr += "setPinRole "+value+" BL0937CF1"+"\n";
    }
    value = user_param_key.sel_pin_pin;
    if(value != undefined) {
        desc += "- BL0937 SEL on P"+value+"\n";
        scr += "setPinRole "+value+" BL0937SEL"+"\n";
    }
    value = user_param_key.r_pin;
    if(value != undefined) {
        let ch = 1;
        desc += "- LED Red (Channel 1) on P"+value+"\n";
        scr += "backlog setPinRole "+value+" PWM"+"; ";
        scr += "setPinChannel "+value+" "+ch+"\n";
    }
    value = user_param_key.g_pin;
    if(value != undefined) {
        let ch = 2;
        desc += "- LED Green (Channel 2) on P"+value+"\n";
        scr += "backlog setPinRole "+value+" PWM"+"; ";
        scr += "setPinChannel "+value+" "+ch+"\n";
    }
    value = user_param_key.b_pin;
    if(value != undefined) {
        let ch = 3;
        desc += "- LED Blue (Channel 3) on P"+value+"\n";
        scr += "backlog setPinRole "+value+" PWM"+"; ";
        scr += "setPinChannel "+value+" "+ch+"\n";
    }
    value = user_param_key.c_pin;
    if(value != undefined) {
        let ch = 4;
        desc += "- LED Cool (Channel 4) on P"+value+"\n";
        scr += "backlog setPinRole "+value+" PWM"+"; ";
        scr += "setPinChannel "+value+" "+ch+"\n";
    }
    value = user_param_key.w_pin;
    if(value != undefined) {
        let ch = 5;
        desc += "- LED Warm (Channel 5) on P"+value+"\n";
        scr += "backlog setPinRole "+value+" PWM"+"; ";
        scr += "setPinChannel "+value+" "+ch+"\n";
    }
    value = user_param_key.ctrl_pin;
    if(value != undefined) {
        desc += "- Control Pin (TODO) on P"+value+"\n";
        scr += "// TODO: ctrl on "+value+""+"\n";
    }
    value = user_param_key.total_bt_pin;
    if(value != undefined) {
        desc += "- Pair/Toggle All Pin on P"+value+"\n";
        scr += "setPinRole "+value+" Btn_Tgl_All"+"\n";
    }
    // LED
    if(user_param_key.iicscl != undefined)
    {
        let map = ""+user_param_key.iicr + " "+user_param_key.iicg + " "+user_param_key.iicb + " "+user_param_key.iicc + " "+user_param_key.iicw;
        
        let iicscl = user_param_key.iicscl;
        let iicsda = user_param_key.iicsda;
        let ledType = "Unknown";
        // use current (color/cw) setting
        if(user_param_key.ehccur != undefined) {
            ledType = "SM2135";
        } else if(user_param_key.dccur != undefined) {
            ledType = "BP5758D_";
        } else if(user_param_key.cjwcur != undefined) {
            ledType = "BP1658CJ_";
        } else if(user_param_key["2235ccur"] != undefined) {
            ledType = "SM2235";
        } else if(user_param_key["2335ccur"] != undefined) {
            // fallback
            ledType = "SM2235";
        } else {
        
        }
        scr += "startDriver "+ledType.replace("_","")+" // so we have led_map available\n";
        let dat_name = ledType+"DAT";
        let clk_name = ledType+"CLK";
        desc += "- "+dat_name+" on P"+iicsda+"\n";
        desc += "- "+clk_name+" on P"+iicscl+"\n";
        desc += "- LED remap is " + map + "\n";
        scr += "setPinRole "+iicsda+" "+dat_name+"\n";
        scr += "setPinRole "+iicscl+" "+clk_name+"\n";
        scr += "LED_Map "+map+" \n";
        
        
    }
    let ele_rx = user_param_key.ele_rx;
    let ele_tx = user_param_key.ele_tx;
    if(user_param_key.ele_rx != undefined) {
        desc += "- BL0942 (?) RX on P"+ele_rx+"\n";
        desc += "- BL0942 (?) TX on P"+ele_tx+"\n";
        scr += "StartupCommand \"startDriver BL0942\""+"\n";
    }
  const res = {
    desc: desc,
    scr: scr,
    tmpl: tmpl
  };
  return res;
}
function processJSON_OpenBekenTemplateStyle(tmpl) {
    let pins = tmpl.pins;
    
    let desc = "";
    let scr = "";
    for (const pin in pins) {
        pinDesc = pins[pin];
        console.log(`Pin ${pin} is connected to ${pinDesc}.`);
        [roleName, channel] = pinDesc.split(';');
        // remap some old convention
        if(roleName == "Button") {roleName = "Btn"; }
        if(roleName == "Button_n") {roleName = "Btn_n"; }
        if(roleName == "Relay") {roleName = "Rel"; }
        if(roleName == "Relay_n") {roleName = "Rel_n"; }
        desc += "- P"+pin+" is " + roleName + " on channel " + channel +"\n";
        scr += "backlog setPinRole "+pin+" "+roleName+"; setPinChannel " + pin + " " +channel+"\n";
      }
      if(tmpl.flags != undefined) {
        scr += "Flags "+tmpl.flags+"\n";
        desc += "- Flags are set to " + tmpl.flags +"\n";
      }
      if(tmpl.command != undefined) {
        scr += "StartupCommand "+tmpl.command+"\n";
        desc += "- StartupCommand is set to " + tmpl.command +"\n";
      }
    const res = {
      desc: desc,
      scr: scr,
      tmpl: tmpl
    };
    return res;
}
function processJSON(txt) {
    let js = JSON.parse(txt);
    if(js.pins != undefined && js.chip != undefined && js.board != undefined) {
        return processJSON_OpenBekenTemplateStyle(js);
    }
    console.log(js);
    let user_param_key = findUserParamKey(js);
    console.log(user_param_key);
    return processJSON_UserParamKeyStyle(js,user_param_key);
}