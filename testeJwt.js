// const axios = require("axios");

// const token =
//   "YZ->s:W8J+%L;lZRX>vR3*>S+R,H}i4*{}?6(lHCb0]ur7*P;>E%b#<$G-*P8O7OOMZGI(>*FKB}Y8%q*aXykceExZR@d-TE_(%&w%p0O?bB#+p12*J)60mbX)kd11JqR!X24xqE8i]V;2px=m,sff=*GXfPL*Q.Cv!|;R+RG>#e,IrW-@Rx?o$RpGVxLQn[P,a_N1#,{Pj&#vivKYqKTzl6lUfN?yZ,W#v+Gnwh63_ikNsN}5bp)kvM?K2-Joh_";

// axios
//   .get("https://cms.bluemonstercase.com/wp-json/acf/v3/pages/203", {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   .then((res) => console.log(res.data))
//   .catch((err) => console.error(err.response?.data || err.message));

// const axios = require("axios");

// const WP_URL = "https://cms.bluemonstercase.com";
// const USERNAME = "admin"; // seu usuário do WP
// const PASSWORD = "Bluemonster2025@"; // sua senha

// async function getToken() {
//   try {
//     const { data } = await axios.post(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
//       username: USERNAME,
//       password: PASSWORD,
//     });

//     console.log("Token gerado:", data.token);

//     return data.token;
//   } catch (err) {
//     console.log("Erro ao gerar token:", err.response?.data || err.message);
//   }
// }

// async function getAcfPage(pageId) {
//   const token = await getToken();
//   if (!token) return;

//   try {
//     const { data } = await axios.get(
//       `${WP_URL}/wp-json/acf/v3/pages/${pageId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Página ACF:", data);
//   } catch (err) {
//     console.log(
//       "Erro ao buscar página ACF:",
//       err.response?.data || err.message
//     );
//   }
// }

// // Troque 203 pelo ID da página que deseja buscar
// getAcfPage(203);

// const axios = require("axios");

// const WP_URL = "https://cms.bluemonstercase.com";

// async function getToken() {
//   try {
//     const { data } = await axios.post(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
//       username: "admin",
//       password: "Bluemonster2025@",
//     });
//     console.log("Token JWT:", data.token);
//   } catch (err) {
//     console.log("Erro:", err.response?.data);
//   }
// }

// getToken();

// const axios = require("axios");

// const WP_URL = "https://cms.bluemonstercase.com";
// const TOKEN =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Ntcy5ibHVlbW9uc3RlcmNhc2UuY29tIiwiaWF0IjoxNzU4MTQ0MTA5LCJuYmYiOjE3NTgxNDQxMDksImV4cCI6MTc1ODc0ODkwOSwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMSJ9fX0.Cjxq8iJ7Hgboxtjw0w7-LWrhmLh1bFaQGVYsrKDBTF4";

// async function getPageACF() {
//   try {
//     const { data } = await axios.get(`${WP_URL}/wp-json/acf/v3/pages/203`, {
//       headers: {
//         Authorization: `Bearer ${TOKEN}`,
//       },
//     });
//     console.log(data);
//   } catch (err) {
//     // JS puro
//     console.error("Erro ao buscar ACF:", err.response?.data || err.message);
//   }
// }

// getPageACF();
