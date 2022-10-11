export type Node = Root | Paragraph | Text | Bold | GenreLink | Link
export type Parent = Root | Paragraph
export type Child = Paragraph | Text | GenreLink | Link

export type Root = { type: 'Root'; children: Paragraph[] }
export type Paragraph = {
  type: 'Paragraph'
  children: (Text | Bold | GenreLink | Link)[]
}
export type Text = { type: 'Text'; text: string }
export type Bold = { type: 'Bold'; text: string }
export type GenreLink = { type: 'GenreLink'; id: number }
export type Link = { type: 'Link'; href: string }
