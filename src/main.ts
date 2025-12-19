import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Desktop } from '@wxcc-desktop/sdk';

@customElement('video-escalation-widget')
export class VideoEscalationWidget extends LitElement {
  @state() private status: string = '';
  @state() private customerLink: string = '';

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .card {
      padding: 16px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      max-width: 320px;
      text-align: center;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      background: linear-gradient(135deg, #0073e6, #005bb5);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 115, 230, 0.3);
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 115, 230, 0.4);
    }
    button:active {
      transform: translateY(0);
    }
    svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    .status {
      margin-top: 16px;
      padding: 12px;
      background: rgba(0, 180, 120, 0.1);
      border: 1px solid #00b478;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      animation: fadeIn 0.5s ease;
    }
    .status a {
      color: #0073e6;
      text-decoration: underline;
      font-weight: 600;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    Desktop.config.init({
      widgetName: 'Instant Video Escalation',
      widgetProvider: 'Bucher + Suter'
    });
  }

async createInstantMeeting() {
  this.status = 'Creating instant meeting...';
  this.customerLink = '';

  try {
    const token = await Desktop.actions.getToken();

    const response = await fetch('https://webexapis.com/v1/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Instant Video Escalation - Webex Contact Center',
        enabledAutoRecordMeeting: false,
        allowAnyUserToBeCoHost: false,
        requireAttendeeLogin: false,
        password: '',
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const meeting = await response.json();
    this.customerLink = meeting.webLink;

    await navigator.clipboard.writeText(this.customerLink);

    this.status = `Instant meeting created!<br>Customer link copied: <a href="${this.customerLink}" target="_blank">${this.customerLink}</a><br>Paste into chat or read aloud.`;

    // Optional: Auto-open agent's host link (recommended for faster join)
    if (meeting.hostLink) {
      window.open(meeting.hostLink, '_blank');
    }

  } catch (err) {
    this.status = `Error: ${(err as Error).message || 'Failed to create meeting'}`;
  }
}

  render() {
    return html`
      <div class="card">
        <button @click=${this.createInstantMeeting}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          Escalate to Video
        </button>
        ${this.status ? html`<div class="status" .innerHTML=${this.status}></div>` : ''}
      </div>
    `;
  }
}