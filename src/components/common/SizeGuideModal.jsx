import React from "react";
import { X, Ruler, HelpCircle, AlertCircle } from "lucide-react";
import { BANGLE_SIZE_GUIDE } from "../../services/mockData";

export const SizeGuideModal = ({ isOpen, onClose, selectedSize, onSelectSize }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-brand-dark/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-brand-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-forest text-white px-5 py-4 flex items-center justify-between border-b border-brand-champagne/30">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-brand-champagne" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                Bangle Size & Measurement Guide
              </h3>
              <p className="text-xs text-brand-champagne-light font-poppins">
                Find your perfect comfortable fit before ordering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition text-brand-champagne-light hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-brand-dark bg-white">
          {/* Size Chart Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif font-bold text-brand-forest text-base">
                Indian Standard Bangle Size Chart
              </h4>
              <span className="text-xs text-brand-forest font-medium bg-brand-champagne/20 border border-brand-champagne/40 px-2.5 py-0.5 rounded-full">
                Accurate Measurements
              </span>
            </div>

            <div className="overflow-x-auto border border-brand-border rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[460px]">
                <thead className="bg-brand-offwhite text-brand-forest border-b border-brand-border font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Inner Diameter</th>
                    <th className="py-2.5 px-3">Inner Circumference</th>
                    <th className="py-2.5 px-3">Wrist / Hand Fit</th>
                    {onSelectSize && <th className="py-2.5 px-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {BANGLE_SIZE_GUIDE.map((row) => {
                    const isCurrent = selectedSize === row.size;
                    return (
                      <tr 
                        key={row.size}
                        className={`hover:bg-brand-offwhite transition ${
                          isCurrent ? "bg-brand-champagne/15 font-semibold text-brand-forest" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-brand-forest">
                          {row.size}
                          {row.size === "2.6" && (
                            <span className="ml-1 text-[10px] bg-brand-champagne/25 text-brand-forest border border-brand-champagne/40 px-1.5 py-0.2 rounded font-normal">
                              Most Popular
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {row.diameterMm} <span className="text-brand-muted">({row.diameterInches})</span>
                        </td>
                        <td className="py-2.5 px-3">{row.circMm}</td>
                        <td className="py-2.5 px-3 text-xs text-brand-dark/80">{row.wristType}</td>
                        {onSelectSize && (
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                onSelectSize(row.size);
                                onClose();
                              }}
                              className={`text-xs px-2.5 py-1 rounded-md transition font-medium ${
                                isCurrent
                                  ? "bg-brand-forest text-white"
                                  : "bg-white border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white"
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
          <div className="bg-brand-offwhite p-4 rounded-xl border border-brand-border space-y-3">
            <h4 className="font-serif font-bold text-brand-forest flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-brand-champagne-dark" />
              <span>How to Measure Your Bangle Size</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Method 1 */}
              <div className="bg-white p-3 rounded-lg border border-brand-border">
                <p className="font-semibold text-brand-forest mb-1">
                  Method 1: Measure an Existing Bangle (Easiest)
                </p>
                <ol className="list-decimal list-inside space-y-1 text-brand-dark/80">
                  <li>Take an existing well-fitting round bangle.</li>
                  <li>Place a straight ruler across the widest inside opening.</li>
                  <li>Measure the exact inner diameter in millimetres (mm).</li>
                  <li>Match with our chart above (e.g. 60.3 mm = Size 2.6).</li>
                </ol>
              </div>

              {/* Method 2 */}
              <div className="bg-white p-3 rounded-lg border border-brand-border">
                <p className="font-semibold text-brand-forest mb-1">
                  Method 2: Hand Circumference with Thread
                </p>
                <ol className="list-decimal list-inside space-y-1 text-brand-dark/80">
                  <li>Bring your thumb and pinky finger together as if putting on a bangle.</li>
                  <li>Wrap a strip of paper or thread around the widest knuckles.</li>
                  <li>Mark the spot where it overlaps and measure with a ruler.</li>
                  <li>This gives your hand circumference.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Expert Tip */}
          <div className="flex items-start space-x-2 text-xs text-brand-dark/85 bg-brand-champagne/15 p-3 rounded-lg border border-brand-champagne/40">
            <AlertCircle className="w-4 h-4 text-brand-champagne-dark shrink-0 mt-0.5" />
            <p>
              <strong className="text-brand-forest">Pro Stylist Tip:</strong> For closed bangles (Pichodi, Tode), choose the exact size that fits over the widest part of your knuckles. For screw-openable or kada designs, you can comfortably choose one size smaller.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-brand-offwhite px-5 py-3 border-t border-brand-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-forest text-white text-xs sm:text-sm font-semibold hover:bg-brand-forest-dark transition"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
