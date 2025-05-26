"use client";

import { useEffect, useState } from "react";
import { Advantage } from "@/types/sportsbook";

export default function HomePage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSport, setFilterSport] = useState<string>("all");

  useEffect(() => {
    fetch("https://betsapi2.p.rapidapi.com/v3/bet365/prematch://betsapi2.p.rapidapi.com/v1/bet365/inplay_filter?sport_id=1", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "betsapi2.p.rapidapi.com",
        "x-rapidapi-key": "5da7cd95ebmshff4da14f2159141p154f27jsnd53855ef90cb",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((json) => {
        setAdvantages(json.advantages || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando eventos...</p>;
  if (error) return <p>Erro: {error}</p>;

  const advantagesWithEvent = advantages.filter(
    (adv) => adv.market && adv.market.event !== undefined
  );

  const sportsList = Array.from(
    new Set(
      advantagesWithEvent
        .map((adv) => adv.market.event!.participants?.[0]?.sport)
        .filter((sport) => sport !== undefined)
    )
  );

  const filteredAdvantages = advantagesWithEvent.filter((adv) => {
    if (filterSport === "all") return true;
    return adv.market.event!.participants?.[0]?.sport === filterSport;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Eventos esportivos</h1>

      <label className="block mb-6">
        Filtrar por esporte:{" "}
        <select
          className="ml-2 p-2 border rounded"
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
        >
          <option value="all">Todos</option>
          {sportsList.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </label>

      {filteredAdvantages.length === 0 ? (
        <p>Nenhum evento para este filtro.</p>
      ) : (
        filteredAdvantages.map((adv) => {
          const event = adv.market.event!;
          const startTime = new Date(event.startTime).toLocaleString();

          return (
            <div
              key={adv.key}
              className="bg-white p-6 rounded shadow-md border border-gray-200 mb-6"
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-gray-600 mb-2">
                Horário: {startTime} | Esporte: {event.participants?.[0]?.sport || "Desconhecido"}
              </p>
              <p className="mb-2">Mercado: {adv.market.type}</p>

              <div className="flex gap-4 flex-wrap">
                {event.participants.map((p) => (
                  <div
                    key={p.key}
                    className="border rounded p-3 w-48 bg-gray-50 shadow-sm"
                  >
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-sm italic text-gray-600">{p.slug}</p>
                    <p>Esporte: {p.sport}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
