// src/utils/request.js

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchWithRetry = async (url, options = {}, retries = 3, retryDelay = 300) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      } else {
        return await res.text();
      }
    } catch (err) {
      if (attempt === retries) {
        console.error(`Fetch failed after ${retries} attempts:`, err);
        throw err;
      }
      console.warn(`Retry ${attempt} failed. Retrying in ${retryDelay}ms...`);
      await sleep(retryDelay);
    }
  }
};
