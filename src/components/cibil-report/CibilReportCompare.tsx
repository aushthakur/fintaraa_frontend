export function CibilReportCompare() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl border-t border-[#d7dfe8] pt-8">
        <h2 className="text-[22px] font-black text-[#111827]">
          Compare your Credit Report across 4 Bureau(s)
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d7dfe8]">
                {["Bureau", "CIBIL", "Experian", "Equifax", "CRIF"].map((head) => (
                  <th key={head} className="px-4 py-3 font-black">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Last Refreshed Date", "1 Jun 26", "1 Jun 26", "1 Jun 26", "1 Jun 26"],
                ["Score", "782", "790", "786", "781"],
                ["Credit Score Insight", "Excellent", "Excellent", "Excellent", "Excellent"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-[#eef2f6]">
                  {row.map((cell, index) => (
                    <td
                      key={`${row[0]}-${cell}-${index}`}
                      className={`px-4 py-3 font-semibold ${index === 0 ? "text-[#111827]" : "text-[#13a653]"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
