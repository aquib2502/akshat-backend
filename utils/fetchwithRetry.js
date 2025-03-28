// Utility function to handle retries for fetch requests
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries === 0) {
        throw error; // No more retries left, throw the error
      }
      console.log(`Retrying... attempts remaining: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay)); // Exponential backoff
      return fetchWithRetry(url, options, retries - 1, delay * 2); // Retry with doubled delay
    }
  };

  export default fetchWithRetry