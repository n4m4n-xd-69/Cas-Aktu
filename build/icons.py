"""
Icon system — inline SVG, Lucide-geometry (24x24, 2px stroke, round caps).
Self-hosted: no icon font, no external library request, no emoji.
Decorative by default (aria-hidden) since every icon here is paired with a
visible text label.
"""

_P = ('<svg viewBox="0 0 24 24" width="{size}" height="{size}" fill="none" stroke="currentColor" '
      'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" '
      'aria-hidden="true" focusable="false">{body}</svg>')

_BODY = {
    # navigation / ui
    "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
    "close": '<path d="M18 6 6 18M6 6l12 12"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    "filter": '<path d="M3 5h18l-7 8v5.5l-4 2V13Z"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
    "chevron-right": '<path d="m9 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 6-6 6 6 6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    # Media controls are filled rather than stroked — at 14px a stroked
    # triangle reads as a smudge.
    "play": '<path d="M7 4.5v15l13-7.5Z" fill="currentColor" stroke="none"/>',
    "pause": '<path d="M8 4.5h3.2v15H8zM12.8 4.5H16v15h-3.2z" fill="currentColor" stroke="none"/>',
    "external": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "moon": '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',

    # sections
    "programs": '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-1.5Z"/><path d="M4 19.5A2 2 0 0 1 6 18h13"/><path d="M9 7h6"/>',
    "admissions": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
    "notices": '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    "documents": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M15 2v5h5"/><path d="M9 13h6M9 17h4"/>',
    "experts": '<circle cx="10" cy="8" r="4"/><path d="M2 21c0-4.4 3.6-7 8-7"/><circle cx="17.5" cy="17.5" r="3.5"/><path d="m21.5 21.5-1.8-1.8"/>',
    "contact": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "research": '<path d="M9 3v6.5L4.2 18A2 2 0 0 0 6 21h12a2 2 0 0 0 1.8-3L15 9.5V3"/><path d="M8 3h8"/><path d="M7 15h10"/>',
    "people": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    "campus": '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M10 21v-5h4v5"/><path d="M9 11h.01M15 11h.01"/>',
    "about": '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',

    # features
    "cpu": '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    "atom": '<circle cx="12" cy="12" r="1"/>'
            '<path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/>'
            '<path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    "robot": '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M9 4h6"/><path d="M9 13h.01M15 13h.01"/><path d="M9.5 17h5"/>',
    "factory": '<path d="M3 21h18V9l-6 4V9l-6 4V4H3Z"/><path d="M8 17h.01M13 17h.01M18 17h.01"/>',
    "energy": '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12Z"/>',
    "award": '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    "beaker": '<path d="M10 2v7L4.5 18.5A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.8-3L14 9V2"/><path d="M9 2h6"/><path d="M7 16h10"/>',
    "building": '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/><path d="M10 22v-4h4v4"/>',
    "wifi": '<path d="M5 12.5a11 11 0 0 1 14 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><path d="M2 9a16 16 0 0 1 20 0"/><path d="M12 20h.01"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    "bed": '<path d="M2 20v-9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9"/><path d="M2 15h20"/><path d="M6 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    "utensils": '<path d="M4 3v7a2.5 2.5 0 0 0 5 0V3"/><path d="M6.5 10v11"/><path d="M17.5 3c-1.7 0-3 2.2-3 5s.6 4 1.5 4h1.5v9"/>',
    "activity": '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    "book": '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-1.5Z"/><path d="M4 19.5A2 2 0 0 1 6 18h13"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v5M16 2v5M3 10h18"/>',
    "download": '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    "sparkles": '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15.5 19.8 18l2.2.9-2.2.8-.8 2.3-.8-2.3-2.2-.8 2.2-.9Z"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
    "layers": '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    "file-badge": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M15 2v5h5"/><circle cx="12" cy="14" r="2.5"/><path d="m10.5 16.2-.5 3 2-1.2 2 1.2-.5-3"/>',
}


def icon(name: str, size: int = 20, stroke: float = 2) -> str:
    body = _BODY.get(name)
    if body is None:
        raise KeyError(f"Unknown icon {name!r}. Available: {sorted(_BODY)}")
    return _P.format(size=size, sw=stroke, body=body)


# Back-compat for existing callers
ICONS = {k: icon(k) for k in _BODY}
