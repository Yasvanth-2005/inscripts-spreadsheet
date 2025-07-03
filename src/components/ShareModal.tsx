import React from "react";
import { X, Users, Link, Mail, MessageSquare } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Share Spreadsheet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <button
            disabled
            className="flex items-center space-x-3 w-full p-3 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Users className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Invite People</div>
              <div className="text-sm">
                Share with specific users - Coming Soon
              </div>
            </div>
          </button>

          <button
            disabled
            className="flex items-center space-x-3 w-full p-3 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Link className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Copy Link</div>
              <div className="text-sm">Get a shareable link - Coming Soon</div>
            </div>
          </button>

          <button
            disabled
            className="flex items-center space-x-3 w-full p-3 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Email</div>
              <div className="text-sm">Share via email - Coming Soon</div>
            </div>
          </button>

          <button
            disabled
            className="flex items-center space-x-3 w-full p-3 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed"
          >
            <MessageSquare className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Slack</div>
              <div className="text-sm">Share to Slack - Coming Soon</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
