import axios from '../helper/axios';

export async function getNftData(wallet: string): Promise<unknown> {
  const options = {
    headers: {
      accept: 'application/json',
      'x-api-key': '204a01e19769439c91ed9513dac1f645',
    },
  };
  const url = `https://api.opensea.io/api/v2/chain/optimism/account/${wallet}/nfts?collection=hoodie-purr-collection-1`;
  // eslint-disable-next-line no-useless-catch
  try {
    const { data } = await axios.get(url, options);
    // console.log("opensea data", data);
    return data;
  } catch (error) {
    // console.error("Error fetching NFT data:", error);
    throw error;
  }
}
