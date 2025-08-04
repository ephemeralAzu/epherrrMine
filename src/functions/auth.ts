import * as config from "./config"
export async function startup(token){
let resp_to_render = {
    error: false,
    data: ""
  }
  let cfg = config.get()
  if(cfg["PLAYER_TOKEN"] === "NULL"){
    resp_to_render.error = true,
    resp_to_render.data = "FIRST_AUTH"
    return resp_to_render
  }else{
    let resp = await fetch(process.env.API_URL + '/player/token/' + cfg["PLAYER_TOKEN"], {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    let response = await resp.json()
    if(response.error){
      console.log(response.data);
    }
    return await resp.json()
  }
}


export async function validate(token: string) {
  
}
export async function auth(login: string, password, string) {}
