
// frontend/src/components/Admin/LessonAnalytics.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function LessonAnalytics (){
  const { lessonsAnalytics } = useAdmin();
  const [timeRange, setTimeRange] = useState('30d');

  // Completion rate chart data
  const completionData = {
    labels: lessonsAnalytics.map(
      (lesson) => lesson.title.substring(0, 20) + '...'
    ),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: lessonsAnalytics.map((lesson) => lesson.completionRate),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Score distribution chart
  const scoreData = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        label: 'Number of Lessons',
        data: [5, 12, 25, 40, 18], // Mock data
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lesson Completion Rates',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Rate (%)',
        },
      },
    },
  };

  return (
    <div className="lesson-analytics">
      <div className="section-header">
        <h3>📚 Lesson Analytics</h3>
        <div className="time-range-selector">
          <button
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
          <button
            className={timeRange === '90d' ? 'active' : ''}
            onClick={() => setTimeRange('90d')}
          >
            90D
          </button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <Bar data={completionData} options={completionOptions} />
        </div>

        <div className="chart-container">
          <Doughnut data={scoreData} />
        </div>
      </div>

      <div className="lessons-table">
        <h4>Lesson Performance Details</h4>
        <table>
          <thead>
            <tr>
              <th>Lesson Title</th>
              <th>Completion Rate</th>
              <th>Average Score</th>
              <th>Avg Time</th>
              <th>Common Errors</th>
            </tr>
          </thead>
          <tbody>
            {lessonsAnalytics.map((lesson) => (
              <tr key={lesson.lessonId}>
                <td className="lesson-title">{lesson.title}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${lesson.completionRate}%` }}
                      ></div>
                    </div>
                    <span>{lesson.completionRate}%</span>
                  </div>
                </td>
                <td className="score-cell">{lesson.averageScore}%</td>
                <td>{Math.round(lesson.averageTime / 60)}m</td>
                <td>
                  <div className="errors-list">
                    {lesson.commonErrors.slice(0, 2).map((error, index) => (
                      <span key={index} className="error-tag">
                        {error}
                      </span>
                    ))}
                    {lesson.commonErrors.length > 2 && (
                      <span className="more-errors">
                        +{lesson.commonErrors.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


