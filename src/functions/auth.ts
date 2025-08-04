import * as config from "./config"
export async function startup(token){
let resp_to_render = {
    error: false,
    data: ""
  }
  let cfg = config.get()
  // if first run
  if(cfg["PLAYER_TOKEN"] === "NULL"){
    if(process.env.DEBUG_MODE) console.log("First run with new config");
    resp_to_render.error = true,
    resp_to_render.data = "FIRST_RUN"
    return resp_to_render

  }else{
    //if not first run - check token
    if(process.env.DEBUG_MODE) console.log("Check token in the config");
    let resp = await fetch(process.env.API_URL + '/player/token/' + cfg["PLAYER_TOKEN"], {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    let response = await resp.json()
    //if error - it error in config - resetting it
    if(response.error){
      if(process.env.DEBUG_MODE) console.log("token in the config incorrect!!!");
      config.reset()
      resp_to_render.error = true,
      resp_to_render.data = "CORRUPTED_CFG"
      return resp_to_render
    }else{
      if(process.env.DEBUG_MODE) console.log("token in the config accepted");
      resp_to_render.error = false,
      resp_to_render.data = "ACCEPTED"
      return resp_to_render
    }
  }
}


export async function validate(token: string) {
  let resp_to_render = {
    error: false,
    data: ""
  }
  let resp = await fetch(process.env.API_URL + '/player/token/' + token, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  let response = await resp.json()
  //if error - it error in config - resetting it
  if(response.error){
    resp_to_render.error = true,
    resp_to_render.data = "INCORRECT_TOKEN"
    return resp_to_render
  }
}
export async function get(token) {
let resp_to_render = {
    error: false,
    data: ""
  }
  let resp = await fetch(process.env.API_URL + '/player/token/' + token, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  let response = await resp.json()
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
