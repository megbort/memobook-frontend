import { expect, waitFor } from 'storybook/test';

// PrimeVue TabList positions its active bar in a setTimeout after mount and throws if the story
// unmounts first, so plays that render tabs wait for it before finishing.
export const waitForTabActiveBar = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const activeBar = canvasElement.querySelector<HTMLElement>('[data-pc-section="activebar"]');
    expect(activeBar?.style.width).toMatch(/px$/);
  });

// PrimeVue fades dialogs and messages in, so they exist before they are visible.
export const waitUntilVisible = (element: HTMLElement) =>
  waitFor(() => expect(element).toBeVisible());
