export default {
  scrollBehavior(to: { hash: string }) {
    if (to.hash) {
      const navbarHeight = document.getElementById('navigation-header')?.offsetHeight || 0;
      return {
        selector: to.hash,
        offset: { x: 0, y: navbarHeight },
        behavior: 'smooth'
      };
    } else {
      return { left: 0, top: 0, behavior: 'smooth' };
    }
  }
};
