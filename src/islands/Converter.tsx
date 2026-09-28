import { useSignal, useSignalEffect } from '@preact/signals';
import { parseCoord } from '../lib/geo/parse';
import { convert } from '../lib/geo/convert';
import { formatDecimal, formatDMS } from '../lib/geo/format';
import type { CoordSystem, ConvertResult } from '../lib/geo/types';
import { SYS_LABEL, SYS_DESC, systemColor } from './labels';

const ALL: CoordSystem[] = ['wgs84', 'gcj02', 'bd09', 'cgcs2000'];

function readUrlParams(): { input: string; from: CoordSystem } {
  if (typeof window === 'undefined') return { input: '', from: 'wgs84' };
  const p = new URLSearchParams(window.location.search);
  return {
    input: p.get('input') ?? '',
    from: (p.get('from') as CoordSystem) ?? 'wgs84',
  };
}

function syncUrl(input: string, from: CoordSystem) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (input) {
    url.searchParams.set('input', input);
    url.searchParams.set('from', from);
  } else {
    url.searchParams.delete('input');
    url.searchParams.delete('from');
  }
  history.replaceState(null, '', url.href);
}

export default function Converter() {
  const rawInput = useSignal('');
  const fromSystem = useSignal<CoordSystem>('wgs84');
  const result = useSignal<ConvertResult | null>(null);
  const error = useSignal('');

  // Init from URL
  useSignalEffect(() => {
    const p = readUrlParams();
    if (p.input) {
      rawInput.value = p.input;
      fromSystem.value = p.from;
    }
  });

  function handleInput(val: string) {
    rawInput.value = val;
    if (!val.trim()) {
      result.value = null;
      error.value = '';
      syncUrl('', fromSystem.value);
      return;
    }
    const parsed = parseCoord(val.trim());
    if (!parsed) {
      result.value = null;
      error.value = '无法解析坐标，请使用 经度,纬度 格式（如 116.404, 39.915）';
      return;
    }
    try {
      const r = convert(parsed.lng, parsed.lat, fromSystem.value);
      result.value = r;
      error.value = '';
      syncUrl(val.trim(), fromSystem.value);
      window.dispatchEvent(
        new CustomEvent('coordchange', {
          detail: { wgs84: r.coords.wgs84, gcj02: r.coords.gcj02 },
        }),
      );
    } catch (e) {
      error.value = '转换出错: ' + (e instanceof Error ? e.message : String(e));
      result.value = null;
    }
  }

  function switchSystem(sys: CoordSystem) {
    fromSystem.value = sys;
    if (rawInput.value.trim()) {
      handleInput(rawInput.value);
    }
  }

  function copyCoord(sys: CoordSystem) {
    if (!result.value) return;
    navigator.clipboard.writeText(formatDecimal(result.value.coords[sys]));
  }

  return (
    <div class="converter">
      <div class="input-row">
        <input
          class="coord-input"
          type="text"
          placeholder="输入坐标，如 116.404, 39.915"
          value={rawInput}
          onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
          aria-label="坐标输入"
        />
        <button
          class="btn-clear"
          onClick={() => {
            rawInput.value = '';
            result.value = null;
            error.value = '';
            syncUrl('', fromSystem.value);
          }}
          aria-label="清除"
        >
          ✕
        </button>
      </div>

      <div class="sys-switch">
        <span class="sys-switch-label">输入坐标系：</span>
        {ALL.map((sys) => (
          <button
            key={sys}
            class={`sys-btn${fromSystem.value === sys ? ' sys-btn--active' : ''}`}
            onClick={() => switchSystem(sys)}
          >
            {SYS_LABEL[sys]}
          </button>
        ))}
      </div>

      {error.value && <div class="error-msg">{error.value}</div>}

      {result.value && (
        <>
          <div class="results-grid">
            {ALL.map((sys) => {
              const c = result.value!.coords[sys];
              const isCgcs = sys === 'cgcs2000';
              return (
                <div key={sys} class="result-card">
                  <div class="result-header">
                    <span class="result-sys">{SYS_LABEL[sys]}</span>
                    <span class="result-desc">{SYS_DESC[sys]}</span>
                  </div>
                  <div class="result-values">
                    {isCgcs ? (
                      <span class="result-note">与 WGS-84 相同</span>
                    ) : (
                      <>
                        <span class="coord-value">{formatDMS(c)}</span>
                        <span class="coord-decimal">{formatDecimal(c)}</span>
                      </>
                    )}
                  </div>
                  <button class="btn-copy" onClick={() => copyCoord(sys)}>
                    {isCgcs ? '↗ 同 WGS-84' : '📋 复制'}
                  </button>
                </div>
              );
            })}
          </div>
          <p class="precision-note">
            ℹ 精度说明：WGS-84↔GCJ-02 约 1-2 米（公开近似算法）；
            CGCS2000↔WGS-84 厘米级差异，视同相同
          </p>
        </>
      )}
    </div>
  );
}