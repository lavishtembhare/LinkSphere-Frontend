import { useReveal } from '../hooks/useAnimations'

const Card = ({ icon: Icon, title, desc, delay = 0 }) => {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`group relative overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card p-6 shadow-inner-light transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40 hover:bg-surface hover:shadow-glow-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Top subtle light reflection line */}
      <div className="pointer-events-none absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {Icon && (
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-edge-subtle bg-ink-900 text-accent-cyan shadow-inner-light transition-all duration-300 group-hover:border-accent-blue/50 group-hover:bg-accent-blue/15 group-hover:text-white group-hover:shadow-glow-blue">
          <Icon size={20} />
        </div>
      )}

      <h3 className="mb-2.5 font-display text-base font-semibold tracking-tight text-white transition-colors group-hover:text-accent-cyan">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300">
        {desc}
      </p>
    </div>
  )
}

export default Card