import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { MapPin, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCityAggregates } from '../../data/projects';
import { formatINR } from '../../utils/formatters';
import CityProjectsModal from './CityProjectsModal';

// Path to the India TopoJSON we'll place in /public
// (See instructions in README.md → public/india-states.json)
const INDIA_TOPO = '/india-states.json';

export default function IndiaMap({ projects }) {
  const { isStateBoard, user } = useAuth();
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Aggregate projects by city → one dot per city, sized by count
  const cityDots = useMemo(() => getCityAggregates(projects), [projects]);

  // For state boards, focus the map on their state by adjusting center/zoom
  // (For now we keep India-wide view; state-board users still see all states drawn but only their dots)
  const mapCenter = [82.5, 22.5];
  const mapScale = 1000;

  const maxCount = Math.max(...cityDots.map(c => c.count), 1);

  // Dot radius scales with project count
  const dotRadius = (count) => 4 + (count / maxCount) * 10;

  return (
    <div className="card p-0 overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-forest-100 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-forest-900">Project Locations</h2>
          <p className="text-xs text-forest-500 mt-0.5">
            {isStateBoard
              ? `Showing ${user.state} projects only`
              : `${cityDots.length} cities · ${projects.length} projects across India`}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-forest-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-600 ring-2 ring-forest-200" />
            Project site
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gold-500 ring-2 ring-yellow-200" />
            Hub (5+ projects)
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative bg-gradient-to-b from-stone-50 to-forest-50/50">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: mapScale, center: mapCenter }}
          width={800}
          height={700}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup>
            <Geographies geography={INDIA_TOPO}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName =
                    geo.properties.st_nm ||
                    geo.properties.NAME_1 ||
                    geo.properties.name ||
                    geo.properties.ST_NM;

                  const isMyState = isStateBoard && stateName === user.state;
                  const isHovered = stateName === hoveredState;

                  // Dim states the state-board user can't access
                  const dimmed = isStateBoard && !isMyState;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredState(stateName)}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: {
                          fill: dimmed
                            ? '#f5f5f4'
                            : isMyState
                              ? '#dcebde'
                              : '#f0f7f1',
                          stroke: '#234e30',
                          strokeWidth: isMyState ? 0.8 : 0.4,
                          outline: 'none',
                        },
                        hover: {
                          fill: dimmed ? '#f5f5f4' : '#bbd7c0',
                          stroke: '#163220',
                          strokeWidth: 0.7,
                          outline: 'none',
                          cursor: dimmed ? 'not-allowed' : 'pointer',
                        },
                        pressed: { fill: '#8fbb98', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* City dots */}
            {cityDots.map((c, i) => (
              <Marker
                key={`${c.city}-${i}`}
                coordinates={[c.lng, c.lat]}
                onClick={() => setSelectedCity(c)}
                onMouseEnter={(e) => setTooltipPos({ x: e.clientX, y: e.clientY, city: c })}
                onMouseLeave={() => setTooltipPos({ x: 0, y: 0 })}
              >
                {/* Outer halo for hubs */}
                {c.count >= 3 && (
                  <circle
                    r={dotRadius(c.count) + 4}
                    fill={c.count >= 5 ? '#fef9c3' : '#dcebde'}
                    opacity={0.6}
                  />
                )}
                <circle
                  r={dotRadius(c.count)}
                  fill={c.count >= 5 ? '#c89b1f' : '#2d633c'}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                />
                {c.count >= 3 && (
                  <text
                    textAnchor="middle"
                    y={3}
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 8,
                      fontWeight: 700,
                      fill: '#fff',
                      pointerEvents: 'none',
                    }}
                  >
                    {c.count}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Hovered state label */}
        {hoveredState && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-soft border border-forest-100 pointer-events-none">
            <div className="text-xs uppercase tracking-wider text-forest-500">State</div>
            <div className="font-display text-base text-forest-900">{hoveredState}</div>
          </div>
        )}

        {/* City hover tooltip */}
        {tooltipPos.city && (
          <div
            className="fixed z-50 bg-forest-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs pointer-events-none"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y + 12,
            }}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3 h-3 text-gold-400" />
              {tooltipPos.city.city}, {tooltipPos.city.state}
            </div>
            <div className="text-forest-200 mt-0.5">
              {tooltipPos.city.count} project{tooltipPos.city.count > 1 ? 's' : ''} · {formatINR(tooltipPos.city.totalFund)}
            </div>
            <div className="text-gold-400 text-[10px] mt-1">Click to view details</div>
          </div>
        )}
      </div>

      {/* City projects modal */}
      {selectedCity && (
        <CityProjectsModal
          city={selectedCity}
          projects={projects.filter(p => p.city === selectedCity.city && p.state === selectedCity.state)}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </div>
  );
}