import * as config from "./config"



export async function startup(){
let resp_to_render = {error: false, data: ""}

  let cfg = config.get()
  // if first run
  if(cfg["PLAYER_TOKEN"] === "NULL"){

    if(process.env.DEBUG_MODE) console.log("Первый запуск с нулевым конфигом");

    resp_to_render.error = true,
    resp_to_render.data = "FIRST_RUN"
    return resp_to_render

  }else{

    //if not first run - check token
    if(process.env.DEBUG_MODE) console.log("Проверка токена из конфига");

    let token = await validate(cfg["PLAYER_TOKEN"])

    //if error - it error in config - resetting it
    if(token.error && token.data == "INCORRECT_TOKEN"){

      if(process.env.DEBUG_MODE) console.log("Токен в конфиге некорректен");

      config.reset()
      resp_to_render.error = true,
      resp_to_render.data = "CORRUPTED_CFG"
      return resp_to_render
    }else{

      if(process.env.DEBUG_MODE) console.log("Токен из конфига принят");

      resp_to_render.error = false,
      resp_to_render.data = "SUCCESS"
      return resp_to_render
    }
  }
}

export async function validate(token: String) {
  let resp_to_render = {error: false, data: ""}

  let validate = await get(token)

  //if error - it error in config - resetting it
  if(validate.error){
    resp_to_render.error = true,
    resp_to_render.data = "INCORRECT_TOKEN"
    return resp_to_render
  }else{
    resp_to_render.error = false,
    resp_to_render.data = "SUCCESS"
    config.set("PLAYER_TOKEN", token)
    return resp_to_render
  }
}

export async function get(token: String) {
let resp_to_render = {error: false, data: ""}

  let resp = await fetch(process.env.API_URL + '/player/token/' + token, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  let response = await resp.json()

  if(process.env.DEBUG_MODE) console.log(response);

  //if error - it error in config - resetting it
  if(response.error){
    resp_to_render.error = true,
    resp_to_render.data = "INCORRECT_TOKEN"
    return resp_to_render
  }else{
    resp_to_render.error = false,
    resp_to_render.data = response.data
    return resp_to_render
  }
}

export async function nicknameCheck(){
  let resp_to_render = {error: false, data: ""}
  let cfg = config.get()
  // if first run
  if(cfg["PLAYER_TOKEN"] === "NULL"){
    resp_to_render.error = true
    resp_to_render.data = "NO_TOKEN"
    return resp_to_render
  }
  let player = await get(cfg["PLAYER_TOKEN"])

  if(player.error && player.data === "INCORRECT_TOKEN"){
    config.reset()
    resp_to_render.error = true
    resp_to_render.data = "INCORRECT_TOKEN"
    return resp_to_render
  }  

  if(!player.error && player.data["name"].length == 0){
    resp_to_render.error = true
    resp_to_render.data = "NO_NICKNAME"
    return resp_to_render
  }

  if(!player.error && player.data["name"].length > 2){
    resp_to_render.error = false
    resp_to_render.data = "SUCCESS"
    return resp_to_render
  }
}
