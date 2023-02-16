// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {vaccinations: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getVaccinationsList()
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-msg">Something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {vaccinations} = this.state
    return (
      <>
        <VaccinationCoverage data={vaccinations.last7DaysVaccination} />
        <VaccinationByGender data={vaccinations.vaccinationByGender} />
        <VaccinationByAge data={vaccinations.vaccinationByAge} />
      </>
    )
  }

  getVaccinationsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        vaccinations: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const {apiStatus} = this.state

    let value = ''

    switch (apiStatus) {
      case apiStatusConstants.success:
        value = this.renderSuccessView()
        break
      case apiStatusConstants.inProgress:
        value = this.renderLoadingView()
        break
      case apiStatusConstants.failure:
        value = this.renderFailureView()
        break
      default:
        value = null
        break
    }
    return (
      <div className="main-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {value}
      </div>
    )
  }
}

export default CowinDashboard
