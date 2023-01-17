using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        // where
        Expression<Func<T, bool>> Criteria { get; }

        List<Expression<Func<T, Object>>> Includes { get; }
    }
}