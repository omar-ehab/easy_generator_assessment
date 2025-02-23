type AuthResponse = {
  payload: {
    access_token: string;
    stream_token: string;
  };
};

export default AuthResponse;