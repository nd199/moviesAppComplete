import { useState } from "react";
import { Share, ContentCopy, Close } from "@mui/icons-material";
import { FaWhatsapp, FaTwitter, FaFacebookF } from "react-icons/fa";

const ShareButton = ({ title, tmdbId, mediaType }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/${mediaType === 'movie' ? 'movie' : 'show'}/${tmdbId}`;
  const shareText = `Check out "${title}" on CN.io`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { icon: FaWhatsapp, label: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, color: "#25d366" },
    { icon: FaTwitter, label: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, color: "#1da1f2" },
    { icon: FaFacebookF, label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: "#1877f2" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
      >
        <Share sx={{ fontSize: 18 }} /> Share
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 bg-surface-900 border border-white/10 rounded-xl p-4 shadow-2xl z-50 min-w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-semibold">Share</span>
            <button onClick={() => setOpen(false)} className="text-[#5a6380] hover:text-white cursor-pointer bg-transparent border-none">
              <Close sx={{ fontSize: 18 }} />
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none text-left mb-1"
          >
            <ContentCopy sx={{ fontSize: 18, color: copied ? '#22c55e' : '#8892b0' }} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm hover:bg-white/10 transition-all no-underline"
            >
              <link.icon size={18} color={link.color} />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButton;
