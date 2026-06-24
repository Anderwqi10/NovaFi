const BASE = "https://api.coingecko.com/api/v3";

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

export interface GlobalData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_change_percentage_24h_usd: number;
}

export interface ChartPoint { time: string; price: number }

export async function fetchTopCoins(limit = 10): Promise<CoinMarket[]> {
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true`
  );
  if (!res.ok) throw new Error("CoinGecko markets error");
  return res.json();
}

export async function fetchGlobal(): Promise<GlobalData> {
  const res = await fetch(`${BASE}/global`);
  if (!res.ok) throw new Error("CoinGecko global error");
  const json = await res.json();
  return json.data;
}

export async function fetchCoinChart(
  coinId: string,
  days: number | string = 1
): Promise<ChartPoint[]> {
  const res = await fetch(
    `${BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("CoinGecko chart error");
  const json = await res.json();
  return (json.prices as [number, number][]).map(([ts, price]) => ({
    time: new Date(ts).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
    price: parseFloat(price.toFixed(4)),
  }));
}

export async function fetchCoinDetail(coinId: string) {
  const res = await fetch(
    `${BASE}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error("CoinGecko detail error");
  return res.json();
}
