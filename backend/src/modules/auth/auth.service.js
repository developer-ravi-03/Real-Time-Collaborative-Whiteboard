class AuthService {
  async handleWebhook(req) {
    console.log("Webhook received");
  }
}

export default new AuthService();
