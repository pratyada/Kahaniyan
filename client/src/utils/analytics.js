// Google Analytics helper — tracks SPA page views + custom events
// GA is loaded via index.html script tag. This module wraps gtag() calls.

const GA_ID = 'G-S208KLF9NY';

function gtag(...args) {
  if (window.gtag) window.gtag(...args);
}

// Track SPA page navigation (React Router doesn't trigger GA automatically)
export function trackPageView(path, title) {
  gtag('config', GA_ID, { page_path: path, page_title: title });
}

// Track custom events
export function trackEvent(action, category, label, value) {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// ─── Pre-built event trackers ───

export function trackStoryGenerated(mode, value, duration) {
  trackEvent('story_generated', 'engagement', `${mode}_${value}`, duration);
}

export function trackStoryPlayed(storyId, isWisdom) {
  trackEvent('story_played', 'engagement', isWisdom ? 'wisdom' : 'generated', 1);
}

export function trackWisdomStoryPlayed(lessonId, tradition) {
  trackEvent('wisdom_played', 'engagement', `${tradition}_${lessonId}`, 1);
}

export function trackSharedLinkOpened(storyId) {
  trackEvent('shared_link_opened', 'acquisition', storyId, 1);
}

export function trackSignUp() {
  trackEvent('sign_up', 'acquisition', 'google', 1);
}

export function trackOnboardingComplete(childName) {
  trackEvent('onboarding_complete', 'activation', childName, 1);
}

export function trackShareStory(storyId) {
  trackEvent('share_story', 'engagement', storyId, 1);
}

export function trackRadioPlay(stationId) {
  trackEvent('radio_play', 'engagement', stationId, 1);
}

export function trackInvestPageView() {
  trackEvent('invest_page_view', 'monetization', 'invest', 1);
}

export function trackAudioCompleted(storyId, durationMinutes) {
  trackEvent('audio_completed', 'engagement', storyId, durationMinutes);
}

export function trackError(errorType, message) {
  trackEvent('app_error', 'technical', `${errorType}: ${message}`, 1);
}
