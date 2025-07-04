import React, { useState, useEffect, useRef } from "react";
import {
  EyeOff,
  Eye,
  ArrowUpDown,
  Filter,
  Upload,
  Download,
  LayoutGrid,
  ChevronDown,
  MoreHorizontal,
  GitFork,
  Share2,
} from "lucide-react";
import ImportModal from "./ImportModal";
import ShareModal from "./ShareModal";
import NewActionModal from "./NewActionModal";

interface ToolbarProps {
  isColumnSelected: boolean;
  onHideFields: () => void;
  onShowAll: () => void;
  onSort: () => void;
  hiddenColumns: number[];
  onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isColumnSelected,
  onHideFields,
  onShowAll,
  onSort,
  hiddenColumns,
  onExport,
}) => {
  const [showLeftDropdown, setShowLeftDropdown] = useState(false);
  const [showRightDropdown, setShowRightDropdown] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const leftDropdownRef = useRef<HTMLDivElement>(null);
  const rightDropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        leftDropdownRef.current &&
        !leftDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLeftDropdown(false);
      }
      if (
        rightDropdownRef.current &&
        !rightDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRightDropdown(false);
      }
      if (
        threeDotsRef.current &&
        !threeDotsRef.current.contains(event.target as Node)
      ) {
        setShowThreeDotsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewAction = () => {
    setShowNewActionModal(true);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-1 relative sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div
          className="flex items-center space-x-0.5 text-sm"
          onClick={() => setShowLeftDropdown(!showLeftDropdown)}
        >
          <div className="flex items-center text-black flex-shrink-0">
            <span className="text-md font-[400] italic tracking-wide text-gray-800">
              Tool bar
            </span>
            <span className="mx-3 h-6 border-l border-gray-300 opacity-50" />
          </div>

          {/* Desktop tools */}
          <div className="hidden md:flex items-center space-x-3 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => onHideFields()}
              disabled={!isColumnSelected}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              <EyeOff className="w-4 h-4" />
              <span>hide fields</span>
            </button>
            {hiddenColumns.length > 0 && (
              <button
                onClick={() => onShowAll()}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Eye className="w-4 h-4" />
                <span>show fields</span>
              </button>
            )}
            <button
              onClick={() => onSort()}
              disabled={!isColumnSelected}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>
            <button
              disabled={true}
              className="flex items-center space-x-1 text-gray-300 cursor-not-allowed"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button
              disabled={true}
              className="flex items-center space-x-1 text-gray-300 cursor-not-allowed"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Cell View</span>
            </button>
          </div>

          {/* Mobile tools dropdown */}
          <div className="md:hidden relative" ref={leftDropdownRef}>
            <button
              onClick={() => setShowLeftDropdown(!showLeftDropdown)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLeftDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-40">
                <button
                  onClick={() => {
                    onHideFields();
                    setShowLeftDropdown(false);
                  }}
                  disabled={!isColumnSelected}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Hide fields</span>
                </button>
                {hiddenColumns.length > 0 && (
                  <button
                    onClick={() => {
                      onShowAll();
                      setShowLeftDropdown(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Show fields</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onSort();
                    setShowLeftDropdown(false);
                  }}
                  disabled={!isColumnSelected}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort</span>
                </button>
                <button
                  disabled={true}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 cursor-not-allowed"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  disabled={true}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 cursor-not-allowed"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Cell View</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Desktop actions - three dots menu until large screens */}
          <div
            className="hidden md:block lg:hidden relative"
            ref={threeDotsRef}
          >
            <button
              onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showThreeDotsMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-32">
                <button
                  onClick={() => {
                    setShowImportModal(true);
                    setShowThreeDotsMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => {
                    onExport();
                    setShowThreeDotsMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowThreeDotsMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop actions - individual buttons on large screens and above */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() => onExport()}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Mobile actions dropdown */}
          <div className="md:hidden relative" ref={rightDropdownRef}>
            <button
              onClick={() => setShowRightDropdown(!showRightDropdown)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showRightDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-32">
                <button
                  onClick={() => {
                    setShowImportModal(true);
                    setShowRightDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => {
                    onExport();
                    setShowRightDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowRightDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>

          {/* New Action button - always visible */}
          <button
            onClick={handleNewAction}
            className="flex items-center space-x-2 px-3 py-1.5 bg-custom-green text-white text-sm rounded-md hover:bg-opacity-90"
          >
            <GitFork className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden md:inline">New Action</span>
          </button>
        </div>
      </div>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <NewActionModal
        isOpen={showNewActionModal}
        onClose={() => setShowNewActionModal(false)}
      />
    </div>
  );
};

export default Toolbar;
