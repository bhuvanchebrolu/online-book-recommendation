import React from 'react'
import Hero from '../components/formPage/Hero'
import BookRecommendationForm from '../components/formPage/BookRecommendationForm'
import "./Form.css";

export default function Form() {
  return (
    <div className='recommendationForm'>
      <Hero />
      <BookRecommendationForm />
    </div>
  )
}