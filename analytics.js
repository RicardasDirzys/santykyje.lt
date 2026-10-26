/**
 * VšĮ "Santykyje" - Google Analytics 4 (GA4) & Google Consent Mode v2
 * Matavimo ID: G-ZPH6WLMYG9
 * 
 * Atitinka ES BDAR ir Google Ad Grants reikalavimus:
 * 1. Numatytasis sutikimas (Consent Mode v2) nustatytas prieš kraunantis žymoms.
 * 2. Slapukų sutikimo pranešimas su pasirinkimu "Sutinku" arba "Tik būtini".
 * 3. Tikslinių konversijų registravimas Google Ads / Ad Grants:
 *    - generate_lead (kontaktų formos pateikimas)
 *    - contact_email (paspaudimas ant el. pašto)
 *    - contact_phone (paspaudimas ant telefono numerio)
 *    - donate_gpm_copy (paramos 1,2% GPM kodo nukopijavimas)
 *    - donate_eds_click (nukreipimas į VMI EDS)
 *    - outbound_terapijosgidas (perėjimas į TerapijosGidas.lt)
 */

(function() {
    'use strict';

    var GA_ID = 'G-ZPH6WLMYG9';
    var CONSENT_STORAGE_KEY = 'santykyje_cookie_consent';

    // 1. Google Consent Mode v2 Initialization (must run synchronously before tags)
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    var storedConsent = null;
    try {
        storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch (e) {
        // localStorage disabled or private browsing restriction
    }

    if (storedConsent === 'granted') {
        gtag('consent', 'default', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted'
        });
    } else {
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });
    }

    gtag('js', new Date());
    gtag('config', GA_ID, {
        'send_page_view': true,
        'anonymize_ip': true
    });

    // 2. Cookie Consent Banner Logic
    function initCookieBanner() {
        if (storedConsent) return; // User already made a choice

        var banner = document.createElement('div');
        banner.id = 'santykyje-cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Slapukų sutikimas');

        banner.innerHTML = [
            '<div class="cookie-card">',
            '  <div class="cookie-content">',
            '    <div class="cookie-header">',
            '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">',
            '        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
            '      </svg>',
            '      <strong>Privatumas ir slapukai</strong>',
            '    </div>',
            '    <p>Naudojame analitikos slapukus (Google Analytics), kad gerintume lankytojų patirtį ir įvertintume visuomeninių iniciatyvų sklaidą pagal mūsų <a href="privatumo-politika.html" target="_blank" rel="noopener">Privatumo politiką</a>.</p>',
            '  </div>',
            '  <div class="cookie-actions">',
            '    <button type="button" id="cookie-btn-accept" class="cookie-btn cookie-btn-accept">Sutinku</button>',
            '    <button type="button" id="cookie-btn-decline" class="cookie-btn cookie-btn-decline">Tik būtini</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(banner);

        var acceptBtn = document.getElementById('cookie-btn-accept');
        var declineBtn = document.getElementById('cookie-btn-decline');

        function dismissBanner() {
            banner.classList.add('cookie-banner-hidden');
            setTimeout(function() {
                if (banner && banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 300);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                try {
                    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
                } catch (e) {}

                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
                dismissBanner();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                try {
                    localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
                } catch (e) {}

                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied'
                });
                dismissBanner();
            });
        }
    }

    // 3. Conversion Tracking (Google Ad Grants meaningful conversions)
    function initEventTracking() {
        // Track Email Clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'contact_email', {
                    'event_category': 'Contact',
                    'event_label': link.getAttribute('href').replace('mailto:', ''),
                    'value': 1.0,
                    'currency': 'EUR'
                });
            });
        });

        // Track Phone Clicks
        document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'contact_phone', {
                    'event_category': 'Contact',
                    'event_label': link.getAttribute('href').replace('tel:', ''),
                    'value': 1.0,
                    'currency': 'EUR'
                });
            });
        });

        // Track Contact Form Submit (generate_lead)
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                var topic = document.getElementById('contact-topic');
                var topicValue = topic ? topic.value : 'Bendra užklausa';

                gtag('event', 'generate_lead', {
                    'event_category': 'Lead',
                    'event_label': 'Contact Form: ' + topicValue,
                    'lead_type': topicValue,
                    'value': 10.0,
                    'currency': 'EUR'
                });
            });
        }

        // Track 1.2% GPM code copy / interaction
        var copyBox = document.querySelector('.copy-box');
        if (copyBox) {
            copyBox.style.cursor = 'pointer';
            copyBox.setAttribute('title', 'Spustelėkite, kad nukopijuotumėte kodą');
            copyBox.addEventListener('click', function() {
                var codeSpan = document.getElementById('gpm-code');
                var code = codeSpan ? codeSpan.innerText.trim() : '307799595';

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function() {
                        var small = copyBox.querySelector('small');
                        if (small) {
                            var originalText = small.innerText;
                            small.innerText = '✓ Kodas nukopijuotas!';
                            small.style.color = '#2E7D32';
                            setTimeout(function() {
                                small.innerText = originalText;
                                small.style.color = '#E8A33D';
                            }, 2500);
                        }
                    }).catch(function() {});
                }

                gtag('event', 'donate_gpm_copy', {
                    'event_category': 'Donation',
                    'event_label': 'GPM Kodas: ' + code,
                    'value': 5.0,
                    'currency': 'EUR'
                });
            });
        }

        // Track VMI EDS link clicks
        document.querySelectorAll('a[href*="deklaravimas.vmi.lt"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'donate_eds_click', {
                    'event_category': 'Donation',
                    'event_label': 'VMI Deklaravimas',
                    'value': 5.0,
                    'currency': 'EUR'
                });
            });
        });

        // Track clicks to TerapijosGidas.lt
        document.querySelectorAll('a[href*="terapijosgidas.lt"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'outbound_terapijosgidas', {
                    'event_category': 'Partner',
                    'event_label': 'Terapijos Gidas Link'
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initCookieBanner();
            initEventTracking();
        });
    } else {
        initCookieBanner();
        initEventTracking();
    }
})();
