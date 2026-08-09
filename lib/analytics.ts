/* ID de medição do GA4.

   Ainda não existe um ID real — o dono do site não forneceu. Enquanto
   NEXT_PUBLIC_GA_ID não estiver definido, nenhum script de analytics é
   renderizado (ver os dois root layouts). Nada de ID placeholder aqui:
   um G-XXXXXXXXXX inventado passaria por dado real.

   Atenção: variáveis NEXT_PUBLIC_* são embutidas no build, não lidas em
   tempo de execução. Definir a variável na Vercel exige um novo deploy
   para ter efeito. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
