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
            const gradient = ctx.createLinearGradient(0, 0, 0, 240)
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')
            return gradient
          }
          return 'rgba(56, 189, 248, 0.75)'
        },
        borderRadius: chartType === 'bar' ? 4 : 0,
        fill: chartType === 'line',
        tension: 0.35,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#38BDF8',
        pointHoverBackgroundColor: '#38BDF8',
        pointHoverBorderColor: '#FFFFFF',
        pointRadius: chartType === 'line' ? 3 : 0,
        pointHoverRadius: 5,
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
        padding: 8,
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
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94A3B8',
          font: { size: 10 },
          stepSize: 1,
          precision: 0,
        },
      },
    },
  }

  return (
    <div className="rounded-2xl border border-edge-subtle bg-surface-card/85 p-4 shadow-xl backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-edge-subtle pb-3 sm:mb-6 sm:pb-4">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
            Traffic Intelligence
          </span>
          <h2 className="text-base font-bold text-white sm:text-lg">Daily Click Telemetry</h2>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl border border-edge-subtle bg-ink-950 p-0.5 sm:p-1">
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${
              chartType === 'line'
                ? 'border border-accent-blue/30 bg-accent-blue/20 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiTrendingUp size={13} /> Line
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${
              chartType === 'bar'
                ? 'border border-accent-blue/30 bg-accent-blue/20 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiBarChart2 size={13} /> Bar
          </button>
        </div>
      </div>

      <div className="relative flex h-52 w-full items-center justify-center sm:h-64 lg:h-72">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-12 w-12 animate-ping rounded-full bg-accent-cyan/15 blur-sm" />
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_10px_#38BDF8] [animation-delay:-0.32s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-blue shadow-[0_0_10px_#3B82F6] [animation-delay:-0.16s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
              </div>
            </div>

            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:text-xs">
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