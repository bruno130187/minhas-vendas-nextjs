import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: 'Iv1.4219e1cb37846f28',
            clientSecret:  'b5c13287c5cbaec4c51afd300fd5486b5198309b'
        }),
        Providers.Auth0({
            clientId: '0KXUgkfCCc1QhB8vW33lWtdG0U5n8CV3',
            clientSecret: 'fP4ZEjRxCnIp-2xFyvLQK7zVT5maso9IWqiRg7ZUrfo80BfmL8KOvKC3fdABLjQQ',
            domain: 'dev-5xu0hfkep15vrx4n.us.auth0.com',
        }),
    ]
})