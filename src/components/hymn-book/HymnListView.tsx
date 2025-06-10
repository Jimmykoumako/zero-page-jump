
import HymnPageHeader from "../HymnPageHeader";
import QRCodeDisplay from "../QRCodeDisplay";
import HymnList from "../HymnList";
import { Hymn } from "@/data/hymns";

interface HymnListViewProps {
  hymns: Hymn[];
  mode: 'hymnal' | 'display';
  deviceId: string;
  showQR: boolean;
  selectedHymnbook?: any;
  groupSession?: {sessionId: string, isLeader: boolean} | null;
  onBack: () => void;
  onToggleQR: () => void;
  onHymnSelect: (hymnId: number) => void;
}

const HymnListView = ({
  hymns,
  mode,
  deviceId,
  showQR,
  selectedHymnbook,
  groupSession,
  onBack,
  onToggleQR,
  onHymnSelect
}: HymnListViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <HymnPageHeader 
          onBack={onBack}
          mode={mode}
          showQR={showQR}
          onToggleQR={onToggleQR}
          selectedHymnbook={selectedHymnbook}
          groupSession={groupSession}
        />

        {showQR && mode === 'display' && (
          <QRCodeDisplay deviceId={deviceId} />
        )}

        <HymnList 
          hymns={hymns}
          onHymnSelect={onHymnSelect}
          selectedHymnbook={selectedHymnbook}
        />
      </div>
    </div>
  );
};

export default HymnListView;
