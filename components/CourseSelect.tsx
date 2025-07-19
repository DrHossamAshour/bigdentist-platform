'use client'

import { useState, useEffect } from 'react'
import Select from 'react-select'

interface Course {
  id: string
  title: string
}

interface CourseSelectProps {
  value: string[]
  onChange: (courseIds: string[]) => void
  placeholder?: string
}

export default function CourseSelect({ value, onChange, placeholder = "Search and select courses..." }: CourseSelectProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // Fetch courses based on search input
  const fetchCourses = async (search: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/ids?search=${encodeURIComponent(search)}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load initial courses
  useEffect(() => {
    fetchCourses('')
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses(inputValue)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
  }

  const handleChange = (selectedOptions: any) => {
    const courseIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    onChange(courseIds)
  }

  // Convert course IDs to options for react-select
  const selectedOptions = value.map(id => {
    const course = courses.find(c => c.id === id)
    return course ? { value: course.id, label: course.title } : null
  }).filter(Boolean)

  // Convert all courses to options for react-select
  const options = courses.map(course => ({
    value: course.id,
    label: course.title
  }))

  return (
    <Select
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      placeholder={placeholder}
      isLoading={loading}
      isClearable
      isSearchable
      className="w-full"
      classNamePrefix="react-select"
      noOptionsMessage={() => "No courses found"}
      loadingMessage={() => "Loading courses..."}
    />
  )
} 