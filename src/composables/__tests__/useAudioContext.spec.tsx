import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAudioContext } from "@/composables/useAudioContext";
import { AudioContext } from "@/__tests__/setup.useAudioContext";

Object.assign(globalThis, { AudioContext });

// `useRafFn` drives the callback through requestAnimationFrame, which is
// async. Capture the scheduled frame so each test can run it on demand and
// observe the data the render loop produced.
let rafCallback: FrameRequestCallback | null;

beforeEach(() => {
  rafCallback = null;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafCallback = cb;
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function runFrame() {
  rafCallback?.(performance.now());
}

describe("useAudioContext", () => {
  it("does not start on init", () => {
    let fdata: Uint8Array | undefined;
    renderHook(() =>
      useAudioContext(null, null, (data: Uint8Array) => {
        fdata = data;
      })
    );
    expect(fdata).toBeUndefined();
  });

  it("default fftSize is 1024 and frequency is 512", () => {
    const player = new Audio("music.mp3");
    let fdata: Uint8Array | undefined;
    renderHook(() =>
      useAudioContext(player, null, (data: Uint8Array) => {
        fdata = data;
      })
    );
    player.dispatchEvent(new Event("play"));
    runFrame();
    player.dispatchEvent(new Event("pause"));
    expect(fdata).not.toBeUndefined();
    expect(fdata).toHaveLength(512);
  });

  it("set fftSize", () => {
    const player = new Audio("music.mp3");
    let fdata: Uint8Array | undefined;
    renderHook(() =>
      useAudioContext(player, 128, (data: Uint8Array) => {
        fdata = data;
      })
    );
    player.dispatchEvent(new Event("play"));
    runFrame();
    player.dispatchEvent(new Event("pause"));
    expect(fdata).toHaveLength(64);
  });
});
