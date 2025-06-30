import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 20 },
    { duration: "2m", target: 50 },
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  const url = "http://api-gateway:8080/idm/auth/login";
  const payload = JSON.stringify({
    username: "njroffic@gmail.com",
    password: "Cezarone2002.",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status 200": (r) => r.status === 200,
    "returnează token": (r) => r.json("token") !== undefined,
  });
}
