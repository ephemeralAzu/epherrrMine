export async function validate(token: string) {
  const resp = await fetch(process.env.VITE_API_URL + '/user/validate/' + token, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return await resp.json()
}
export async function auth(login: string, password, string) {}
