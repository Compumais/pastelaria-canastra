interface PageTitleProps {
  title: string
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <h2 className="text-2xl font-bold max-sm:text-base max-sm:font-semibold">
      { title }
    </h2>
  )
}