export class DadJokesService {
  public static async getJoke() {
    const response = await (await fetch("https://icanhazdadjoke.com", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Voice generation (https://github.com/Stelele/voice-generation-site)",
      }
    })).json()

    return response.joke
  }
}
