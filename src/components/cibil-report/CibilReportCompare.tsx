
import Link from "next/link";
import { Download } from "lucide-react";

export function CibilReportCompare() {
  return (
      <div className="mt-6 max-w-9xl mx-auto px-4 md:px-6 lg:px-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-17px font-bold tracking-tight text-gray-900 mb-5">
          Compare your Credit Report across 4 Bureau(s)
        </h3>

        div

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-170">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 text-xs font-bold text-gray-900 w-[25%] leading-tight">
                  Bureau <br />
                  <span className="font-medium text-gray-400 text-[11px]">Last Refresh Date</span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-bold text-[#00a4eb] tracking-wide">CIBIL</span>
                  <span className="block text-[11px] font-medium text-gray-400 mt-0.5">1 Jun &apos;26</span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-serif font-black italic text-[#de1f26] tracking-tight">EQUIFAX</span>
                  <span className="block text-[11px] font-medium text-gray-400 mt-0.5">1 Jun &apos;26</span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-sans font-bold text-purple-600 lowercase">experian</span>
                  <span className="block text-[11px] font-medium text-gray-400 mt-0.5">1 Jun &apos;26</span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-sans font-extrabold text-blue-900 uppercase italic">
                    CRIF <span className="text-[9px] text-orange-500 not-italic font-bold -ml-0.5">HIGH MARK</span>
                  </span>
                  <span className="block text-[11px] font-medium text-gray-400 mt-0.5">1 Jun &apos;26</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Score
                </td>
                <td className="py-4 text-center text-xs font-semibold text-gray-400">750</td>
                <td className="py-4 text-center text-xs font-bold text-[#00a653]">780</td>
                <td className="py-4 text-center text-xs font-semibold text-gray-400">830</td>
                <td className="py-4 text-center text-[11px] font-medium text-gray-400">No History</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Insights Row Section */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-[13px] font-bold text-gray-900">Credit Score Insights</h4>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              A deeper look into the factors behind your score
            </p>
          </div>
          
          <Link
            href="/cibil-score/report"
            className="flex h-9 items-center justify-center gap-2 rounded-full bg-[#00a653] px-6 text-xs font-bold text-white transition-all hover:bg-[#009349]"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
            Download Report
          </Link>
        </div>
      </div>
  );
}
