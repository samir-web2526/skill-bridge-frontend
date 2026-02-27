import { authClient } from "@/lib/auth-client";

export const userClientService = {
    loginUser: async function (email: string, password: string) {
    try {
      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          fetchOptions: {
            credentials: "include",
          },
        },
      );
      if (error) {
        return {
          data: null,
          error: { message: error.message },
        };
      }
      return { data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: error.message || "Something went wrong" },
      };
    }
  },

  regiserUser: async function (
    name: string,
    email: string,
    password: string
  ) {
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password
      });
      if (error) return { data: null, error: { message: error.message } };
      return { data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: error.message || "Something went wrong" },
      };
    }
  }
}