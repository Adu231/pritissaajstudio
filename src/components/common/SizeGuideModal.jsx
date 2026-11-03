import React from "react";
import { X, Ruler, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { BANGLE_SIZE_GUIDE } from "../../services/mockData";

export const SizeGuideModal = ({ isOpen, onClose, selectedSize, onSelectSize }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-brand-sage-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-emerald text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-brand-gold" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                Bangle Size & Measurement Guide
              </h3>
              <p className="text-xs text-brand-sage-light font-poppins">
                Find your perfect comfortable fit before ordering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition text-brand-sage-light hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-brand-charcoal">
          {/* Size Chart Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif font-bold text-brand-emerald text-base">
                Indian Standard Bangle Size Chart
              </h4>
              <span className="text-xs text-brand-gold-dark font-medium bg-brand-gold/10 px-2 py-0.5 rounded-full">
                Accurate Measurements
              </span>
            </div>

            <div className="overflow-x-auto border border-brand-sage-light rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[460px]">
                <thead className="bg-brand-ivory text-brand-emerald border-b border-brand-sage-light font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Inner Diameter</th>
                    <th className="py-2.5 px-3">Inner Circumference</th>
                    <th className="py-2.5 px-3">Wrist / Hand Fit</th>
                    {onSelectSize && <th className="py-2.5 px-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sage-light/40">
                  {BANGLE_SIZE_GUIDE.map((row) => {
                    const isCurrent = selectedSize === row.size;
                    return (
                      <tr 
                        key={row.size}
                        className={`hover:bg-brand-sage-light/20 transition ${
                          isCurrent ? "bg-brand-sage-light/30 font-medium" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-brand-emerald">
                          {row.size}
                          {row.size === "2.6" && (
                            <span className="ml-1 text-[10px] bg-brand-gold/20 text-brand-emerald px-1.5 py-0.2 rounded font-normal">
                              Most Popular
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {row.diameterMm} <span className="text-gray-400">({row.diameterInches})</span>
                        </td>
                        <td className="py-2.5 px-3">{row.circMm}</td>
                        <td className="py-2.5 px-3 text-xs text-brand-charcoal-light">{row.wristType}</td>
                        {onSelectSize && (
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                onSelectSize(row.size);
                                onClose();
                              }}
                              className={`text-xs px-2.5 py-1 rounded-md transition font-medium ${
                                isCurrent
                                  ? "bg-brand-emerald text-white"
                                  : "bg-brand-sage/30 text-brand-emerald hover:bg-brand-emerald hover:text-white"
                              }`}
                            >
                              {isCurrent ? "Selected" : "Select"}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure Guide */}
          <div className="bg-brand-ivory p-4 rounded-xl border border-brand-sage-light/60 space-y-3">
            <h4 className="font-serif font-bold text-brand-emerald flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-brand-gold" />
              <span>How to Measure Your Bangle Size</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Method 1 */}
              <div className="bg-white p-3 rounded-lg border border-brand-sage-light/50">
                <p className="font-semibold text-brand-emerald mb-1">
                  Method 1: Measure an Existing Bangle (Easiest)
                </p>
                <ol className="list-decimal list-inside space-y-1 text-brand-charcoal-light">
                  <li>Take an existing well-fitting round bangle.</li>
                  <li>Place a straight ruler across the widest inside opening.</li>
                  <li>Measure the exact inner diameter in millimetres (mm).</li>
                  <li>Match with our chart above (e.g. 60.3 mm = Size 2.6).</li>
                </ol>
              </div>

              {/* Method 2 */}
              <div className="bg-white p-3 rounded-lg border border-brand-sage-light/50">
                <p className="font-semibold text-brand-emerald mb-1">
                  Method 2: Hand Circumference with Thread
                </p>
                <ol className="list-decimal list-inside space-y-1 text-brand-charcoal-light">
                  <li>Bring your thumb and pinky finger together as if putting on a bangle.</li>
                  <li>Wrap a strip of paper or thread around the widest knuckles.</li>
                  <li>Mark the spot where it overlaps and measure with a ruler.</li>
                  <li>This gives your hand circumference.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Expert Tip */}
          <div className="flex items-start space-x-2 text-xs text-brand-charcoal-light bg-brand-gold/10 p-3 rounded-lg border border-brand-gold/30">
            <AlertCircle className="w-4 h-4 text-brand-gold-dark shrink-0 mt-0.5" />
            <p>
              <strong className="text-brand-charcoal">Pro Stylist Tip:</strong> For closed bangles (Pichodi, Tode), choose the exact size that fits over the widest part of your knuckles. For screw-openable or kada designs, you can comfortably choose one size smaller.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-brand-sage-light flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-brand-emerald text-white text-xs sm:text-sm font-medium hover:bg-brand-emerald-light transition"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

