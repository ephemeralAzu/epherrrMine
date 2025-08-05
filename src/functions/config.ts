import * as fs from 'fs'
let config_example = 
  "DEBUG_MODE=false;\n" +
  "PLAYER_ID=NULL;\n" +
  "PLAYER_UUID=NULL;\n" +
  "PLAYER_NICKNAME=NULL;\n" +
  "PLAYER_TOKEN=NULL;\n" +
  "UPDATE_CHANNEL=release;\n" +
  "APP_DIR=" + process.env.APP_DIR

let config = new Object()

export function get(){
  if(process.env.DEBUG_MODE) console.log(config);
  return config
}

export function set(name, value){
  config[name] = value
  let keys = Object.keys(config);
  let str = ""
  keys.forEach(key => {
    str += key + "=" + config[key] + ";\n"
  });
  fs.writeFileSync(process.env.APP_DIR + '\\default.conf', str)
}

export function reset() {
  if(process.env.DEBUG_MODE) console.log("Конфиг сломан - перезапись");

    fs.writeFileSync(process.env.APP_DIR + '\\default.conf', config_example)

    config = read()
    return config
}

export function read() {
  if(fs.existsSync(process.env.APP_DIR + '\\default.conf')){
    let cfgStr = fs.readFileSync(process.env.APP_DIR + '\\default.conf').toString()
    let vars = cfgStr.replace(/\r?\n|\r/g, '')
    let variables = vars.split(";")
    let cfg = new Array()

    variables.forEach(variable => {
      let string = variable.split("=")
      if(string[0].length > 0 && string[0].length) cfg[string[0]] = string[1]
      config = cfg
    });
    return config
  }else{    
    return reset()
  }
}
