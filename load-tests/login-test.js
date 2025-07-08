import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      stages: [
        { duration: "2m", target: 100 },
        { duration: "3m", target: 100 },
        { duration: "2m", target: 200 },
        { duration: "3m", target: 200 },
        { duration: "2m", target: 300 },
        { duration: "3m", target: 300 },
        { duration: "1m", target: 0 },
      ],
    },
  },
};

export default function () {
  const url = "lb://apigateway:8080/idm/auth/login";
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
