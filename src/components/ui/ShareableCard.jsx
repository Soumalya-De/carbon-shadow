import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { exportComponentAsPNG } from '../../utils/imageExport';
import { 
  LinkedinLogo, 
  XLogo, 
  FacebookLogo, 
  WhatsappLogo, 
  TelegramLogo, 
  ThreadsLogo, 
  InstagramLogo, 
  DiscordLogo, 
  Envelope, 
  Link, 
  Download, 
  QrCode 
} from "@phosphor-icons/react";

export function ShareableCard() {
  const { 
    shareModalOpen, 
    toggleShareModal, 
    reductionScore 
  } = useCarbonShadow();

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [qrVisible, setQrVisible] = useState(false);

  if (!shareModalOpen) return null;

  const projectUrl = window.location.origin + window.location.pathname;
  
  const shareText = `I reduced my digital shadow by ${reductionScore}%.\n\nCarbon Shadow helped me explore a more mindful digital footprint.\n\n#CarbonShadow\n#DigitalSustainability\n#AIForGood`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setFeedbackMessage("✓ Link copied");
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (err) {
      setFeedbackMessage("Failed to copy link.");
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  const handleDownload = async () => {
    const el = document.getElementById('hidden-passport-card');
    if (el) {
      setFeedbackMessage("Preparing download...");
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        await exportComponentAsPNG(el, 'carbon-shadow-passport.png');
        setFeedbackMessage("✓ Downloaded passport");
        setTimeout(() => setFeedbackMessage(""), 3000);
      } catch (err) {
        setFeedbackMessage("Download failed.");
        setTimeout(() => setFeedbackMessage(""), 3000);
      }
    } else {
      setFeedbackMessage("Passport card not found.");
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  const handleInstagramShare = async () => {
    const el = document.getElementById('hidden-passport-card');
    if (el) {
      setFeedbackMessage("Preparing download...");
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        await exportComponentAsPNG(el, 'carbon-shadow-passport.png');
        await navigator.clipboard.writeText(shareText + `\n\nLink: ${projectUrl}`);
        setFeedbackMessage("✓ Downloaded! Caption copied to clipboard.");
        setTimeout(() => setFeedbackMessage(""), 4000);
      } catch (err) {
        setFeedbackMessage("Download failed.");
        setTimeout(() => setFeedbackMessage(""), 3000);
      }
    } else {
      setFeedbackMessage("Passport card not found.");
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  const handleDiscordShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\nLink: ${projectUrl}`);
      setFeedbackMessage("✓ Copied for Discord!");
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (e) {
      setFeedbackMessage("Failed to copy text.");
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  const platforms = [
    {
      name: 'LinkedIn',
      icon: <LinkedinLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareText + `\n\nLink: ${projectUrl}`);
          setFeedbackMessage("Caption copied! Opening LinkedIn...");
          setTimeout(() => setFeedbackMessage(""), 3000);
        } catch (e) {}
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`, '_blank');
      }
    },
    {
      name: 'X',
      icon: <XLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        const twitterText = `I reduced my digital shadow by ${reductionScore}% using Carbon Shadow.\n\n#CarbonShadow #DigitalSustainability`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(projectUrl)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: <FacebookLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`, '_blank');
      }
    },
    {
      name: 'WhatsApp',
      icon: <WhatsappLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        const whatsappText = `${shareText}\n\nLink: ${projectUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: <TelegramLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      }
    },
    {
      name: 'Threads',
      icon: <ThreadsLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, '_blank');
      }
    },
    {
      name: 'Instagram',
      icon: <InstagramLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: handleInstagramShare
    },
    {
      name: 'Discord',
      icon: <DiscordLogo size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: handleDiscordShare
    },
    {
      name: 'Email',
      icon: <Envelope size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => {
        const emailSubject = "My Carbon Shadow Passport";
        const emailBody = `I reduced my digital shadow by ${reductionScore}%.\n\nCheck out my Carbon Shadow Passport:\n\n${projectUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      }
    },
    {
      name: 'Copy Link',
      icon: <Link size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: handleCopyLink
    },
    {
      name: 'Download',
      icon: <Download size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: handleDownload
    },
    {
      name: 'QR Code',
      icon: <QrCode size={24} className="text-[#EAEAEA] group-hover:text-[#00f0ff] transition-all duration-300 group-hover:scale-110" />,
      action: () => setQrVisible(true)
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Click outside to close */}
        <motion.div 
          className="absolute inset-0 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { toggleShareModal(false); setQrVisible(false); }}
        />

        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative max-w-lg w-full rounded-2xl p-7 bg-[#090314]/95 border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col gap-6 z-10 font-sans"
        >
          {/* Close button top right */}
          <button 
            onClick={() => { toggleShareModal(false); setQrVisible(false); }}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors duration-200 text-lg focus:outline-none cursor-pointer"
          >
            ✕
          </button>

          {qrVisible ? (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <span className="text-[10px] tracking-[0.25em] text-[#00f0ff] font-black uppercase">YOUR PASSPORT QR</span>
              <div className="bg-white p-4 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.3)] border border-[#00f0ff]/30 my-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(projectUrl)}`} 
                  alt="QR Code" 
                  className="w-44 h-44"
                />
              </div>
              <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                Scan this code with your phone to view and share your Carbon Shadow Passport.
              </p>
              <button
                onClick={() => setQrVisible(false)}
                className="mt-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
              >
                ← Back
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col text-center gap-1.5 mt-2">
                <span className="text-[10px] tracking-[0.25em] text-[#00f0ff] font-black uppercase">SHARE YOUR SHADOW</span>
                <h3 className="text-sm text-white/70 font-light max-w-xs mx-auto leading-relaxed">
                  Share your Carbon Shadow Passport and inspire more mindful digital habits.
                </h3>
              </div>

              <hr className="border-white/5 my-0.5" />

              {/* Social share grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-1">
                {platforms.map((plat) => (
                  <button
                    key={plat.name}
                    onClick={plat.action}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-[#00f0ff]/50 hover:shadow-[0_0_12px_rgba(0,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-center min-h-[92px] justify-between"
                  >
                    <div className="flex-1 flex items-center justify-center">
                      {plat.icon}
                    </div>
                    <span className="text-[11px] font-medium tracking-wide text-white/70 group-hover:text-white transition-colors mt-2">{plat.name}</span>
                  </button>
                ))}
              </div>

              {feedbackMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-[10px] text-accentCyan font-bold uppercase tracking-wider bg-accentCyan/10 border border-accentCyan/20 py-2.5 rounded-lg"
                >
                  {feedbackMessage}
                </motion.div>
              )}

              <hr className="border-white/5" />

              <button
                onClick={() => toggleShareModal(false)}
                className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ShareableCard;
