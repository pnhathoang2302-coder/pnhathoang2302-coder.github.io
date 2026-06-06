class Typewriter {
  constructor(elementId, phrases, opts = {}) {
    this.el = document.getElementById(elementId);
    this.phrases = phrases;
    this.typeSpeed = opts.typeSpeed || 80;
    this.deleteSpeed = opts.deleteSpeed || 45;
    this.pauseAfter = opts.pauseAfter || 1800;
    this.pauseStart = opts.pauseStart || 500;
    this.index = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    if (this.el) this._tick();
  }

  _tick() {
    const phrase = this.phrases[this.index % this.phrases.length];
    const current = this.isDeleting
      ? phrase.substring(0, this.charIndex - 1)
      : phrase.substring(0, this.charIndex + 1);

    this.el.textContent = current;
    this.charIndex = this.isDeleting ? this.charIndex - 1 : this.charIndex + 1;

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === phrase.length) {
      delay = this.pauseAfter;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.index++;
      delay = this.pauseStart;
    }

    setTimeout(() => this._tick(), delay);
  }
}
