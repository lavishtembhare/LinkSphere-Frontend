import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Graph = ({ graphData = [], isLoading = false }) => {
  const [chartType, setChartType] = useState('line')

  // Format YYYY-MM-DD -> "MMM DD" for x-axis display
  const labels = graphData.map((item) => {
    const parts = item.date.split('-')
    if (parts.length === 3) {
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return item.date
  })

  const clickValues = graphData.map((item) => item.clickCount)

  const data = {
    labels: labels.length ? labels : ['No Data'],
    datasets: [
      {
        label: 'Clicks',
        data: clickValues.length ? clickValues : [0],
        borderColor: '#38BDF8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          if (chartType === 'line') {
            const gradient = ctx.createLinearGradient(0, 0, 0, 280)
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')
            return gradient
          }
          return 'rgba(56, 189, 248, 0.75)'
        },
        borderRadius: chartType === 'bar' ? 6 : 0,
        fill: chartType === 'line',
        tension: 0.35,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#38BDF8',
        pointHoverBackgroundColor: '#38BDF8',
        pointHoverBorderColor: '#FFFFFF',
        pointRadius: chartType === 'line' ? 3.5 : 0,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#080E21',
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        borderColor: 'rgba(59, 130, 246, 0.35)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `Clicks: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          stepSize: 1,
          precision: 0,
        },
      },
    },
  }

  return (
    <div className="rounded-2xl border border-edge-subtle bg-surface-card/85 p-6 shadow-xl backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-edge-subtle pb-4">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Traffic Intelligence
          </span>
          <h2 className="text-lg font-bold text-white">Daily Click Telemetry</h2>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl border border-edge-subtle bg-ink-950 p-1">
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              chartType === 'line'
                ? 'border border-accent-blue/30 bg-accent-blue/20 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiTrendingUp size={14} /> Line
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'border border-accent-blue/30 bg-accent-blue/20 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiBarChart2 size={14} /> Bar
          </button>
        </div>
      </div>

      <div className="relative flex h-72 w-full items-center justify-center">
        {isLoading ? (
          /* Mutating Telemetry Dots Loader */
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
              {/* Radial background pulse */}
              <div className="absolute h-16 w-16 animate-ping rounded-full bg-accent-cyan/15 blur-sm" />

              {/* Mutating sequence dots */}
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_14px_#38BDF8] [animation-delay:-0.32s]" />
                <span className="h-3.5 w-3.5 animate-bounce rounded-full bg-accent-blue shadow-[0_0_14px_#3B82F6] [animation-delay:-0.16s]" />
                <span className="h-3.5 w-3.5 animate-bounce rounded-full bg-white shadow-[0_0_14px_#FFFFFF]" />
              </div>
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Aggregating Telemetry Data...
            </span>
          </div>
        ) : (
          <>{chartType === 'line' ? <Line data={data} options={options} /> : <Bar data={data} options={options} />}</>
        )}
      </div>
    </div>
  )
}

export default Graph