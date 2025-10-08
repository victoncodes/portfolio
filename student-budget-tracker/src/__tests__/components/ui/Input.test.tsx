import { render, screen, fireEvent } from '@testing-library/react'
import Input from '@/components/ui/Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
  })

  it('displays placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  it('handles value and onChange', () => {
    const handleChange = jest.fn()
    render(<Input value="test value" onChange={handleChange} />)
    
    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledWith('new value')
  })

  it('displays error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300')
  })

  it('applies error styling when error is present', () => {
    render(<Input error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-300', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('applies normal styling when no error', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('has required attribute when required prop is true', () => {
    render(<Input required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('focuses input when clicked', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    
    fireEvent.click(input)
    expect(input).toHaveFocus()
  })

  it('handles keyboard input', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledWith('hello')
  })
})