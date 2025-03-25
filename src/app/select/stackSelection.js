import React, { useState } from "react";
import stackOptionsData from "../../lib/stackOptions.json"; // Updated import to JSON file
import * as FaIcons from "react-icons/fa"; // Importing all Fa icons
import * as SiIcons from "react-icons/si"; // Importing all Si icons
import { FaCaretDown } from "react-icons/fa"; // Import down arrow icon

const StackSelection = () => {
  const [selectedStack, setSelectedStack] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState({});
  const [versionModal, setVersionModal] = useState({ open: false, tech: null, position: { top: 0, left: 0 } });

  const toggleSelection = (tech) => {
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    if (!selectedVersions[tech]) {
      setSelectedVersions((prev) => ({
        ...prev,
        [tech]: "latest",
      }));
    }
  };

  const openVersionModal = (tech, event) => {
    const rect = event.target.getBoundingClientRect();
    const modalLeft = rect.left + window.scrollX;
    const modalTop = rect.bottom + window.scrollY;
    const modalRight = window.innerWidth - modalLeft;
    const modalPosition = modalRight < 200 ? { top: modalTop, left: modalLeft - 200 } : { top: modalTop, left: modalLeft };
    setVersionModal({
      open: true,
      tech,
      position: modalPosition,
    });
  };

  const closeVersionModal = () => {
    setVersionModal({ open: false, tech: null, position: { top: 0, left: 0 } });
  };

  const selectVersion = (version) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [versionModal.tech]: version,
    }));
    if (!selectedStack.includes(versionModal.tech)) {
      setSelectedStack((prev) => [...prev, versionModal.tech]);
    }
    closeVersionModal();
  };

  return (
    <div onClick={closeVersionModal}>
      {Object.keys(stackOptionsData).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {stackOptionsData[category].map((stack) => {
              const IconComponent = FaIcons[stack.icon] || SiIcons[stack.icon]; // Dynamically select the icon
              const selectedVersion = selectedVersions[stack.name];
              return (
                <div key={stack.name} className="relative bg-gray-800 rounded-lg shadow-lg p-4">
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      {IconComponent && <IconComponent className="text-6xl h-10" />}
                    </div>
                    <div className="flex justify-between w-full">
                      <div>
                        <span>{stack.name}{selectedVersion ? ` (v${selectedVersion})` : ""}</span>
                      </div>
                      <div>
                        <FaCaretDown
                          onClick={(e) => {
                            e.stopPropagation();
                            openVersionModal(stack.name, e);
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {selectedStack.includes(stack.name) && (
                    <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Version Modal */}
      {versionModal.open && (
        <div
          className="absolute bg-gray-800 p-4 rounded-md shadow-lg z-50"
          style={{ top: versionModal.position.top, left: versionModal.position.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl mb-2">Select Version for {versionModal.tech}</h2>
          <div className="flex flex-col space-y-2">
            {stackOptionsData[Object.keys(stackOptionsData).find(category => stackOptionsData[category].some(tech => tech.name === versionModal.tech))]
              .find((tech) => tech.name === versionModal.tech)
              .versions.map((version) => (
                <button
                  key={version}
                  onClick={() => selectVersion(version)}
                  className={`cursor-pointer p-2 rounded-md transition ${
                    selectedVersions[versionModal.tech] === version
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {version}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StackSelection;
